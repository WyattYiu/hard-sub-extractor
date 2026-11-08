from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import fftconvolve

from .media import ensure_media_tools

SAMPLE_RATE = 8000
FRAME = 400          # 50 ms -> 20 envelopes per second
POOL = 5             # 4 coarse envelopes per second
COARSE_RATE = SAMPLE_RATE / FRAME / POOL
WINDOW_SECONDS = 30
HOP_SECONDS = 10


def _decode_audio(path: str | Path) -> np.ndarray:
    ffmpeg, _ = ensure_media_tools()
    process = subprocess.run(
        [ffmpeg, "-v", "error", "-i", str(path), "-vn", "-ac", "1",
         "-ar", str(SAMPLE_RATE), "-f", "s16le", "pipe:1"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=900,
    )
    if process.returncode != 0:
        detail = process.stderr.decode("utf-8", "ignore").strip().splitlines()
        raise ValueError(detail[-1] if detail else "无法读取音频")
    if not process.stdout:
        raise ValueError("视频没有音轨，无法自动同步")
    return np.frombuffer(process.stdout, dtype="<i2").astype(np.float32) / 32768.0


def _envelope(samples: np.ndarray) -> np.ndarray:
    count = len(samples) // FRAME
    if count < 4:
        raise ValueError("音频太短，无法自动同步")
    frames = samples[: count * FRAME].reshape(count, FRAME)
    rms = np.sqrt(np.mean(frames * frames, axis=1))
    env = np.log1p(4000.0 * rms)
    env = env - env.mean()
    std = env.std()
    return env / std if std > 1e-8 else env


def _pool(env: np.ndarray) -> np.ndarray:
    count = len(env) // POOL
    if count < 2:
        return env.copy()
    return env[: count * POOL].reshape(count, POOL).mean(axis=1)


def _correlation_scores(target: np.ndarray, window: np.ndarray) -> np.ndarray:
    length = len(window)
    if len(target) < length:
        return np.array([], dtype=np.float64)
    corr = fftconvolve(target, window[::-1], mode="valid")
    cumulative = np.concatenate(([0.0], np.cumsum(target)))
    squared = np.concatenate(([0.0], np.cumsum(target * target)))
    sums = cumulative[length:] - cumulative[:-length]
    energies = squared[length:] - squared[:-length]
    window_sum = float(window.sum())
    window_energy = float(np.dot(window, window))
    var_target = np.maximum(energies - sums * sums / length, 1e-9)
    var_window = max(window_energy - window_sum * window_sum / length, 1e-9)
    return (corr - sums * window_sum / length) / np.sqrt(var_target * var_window)


def _robust_line(source: np.ndarray, target: np.ndarray, weights: np.ndarray) -> tuple[float, float, np.ndarray]:
    slope, intercept = np.polyfit(source, target, 1, w=weights)
    residuals = target - (slope * source + intercept)
    center = float(np.median(residuals))
    mad = float(np.median(np.abs(residuals - center))) * 1.4826
    limit = max(1.5, 3.0 * mad)
    inliers = np.abs(residuals - center) <= limit
    if inliers.sum() >= 3:
        slope, intercept = np.polyfit(source[inliers], target[inliers], 1, w=weights[inliers])
        residuals = target - (slope * source + intercept)
        center = float(np.median(residuals))
        mad = float(np.median(np.abs(residuals - center))) * 1.4826
        inliers = np.abs(residuals - center) <= max(1.5, 3.0 * mad)
    return float(slope), float(intercept), inliers


def align_audio(source_path: str | Path, target_path: str | Path) -> dict:
    """Estimate a source-time -> target-time mapping from the two soundtracks."""
    source_samples = _decode_audio(source_path)
    target_samples = _decode_audio(target_path)
    source_duration = len(source_samples) / SAMPLE_RATE
    target_duration = len(target_samples) / SAMPLE_RATE
    source_env = _pool(_envelope(source_samples))
    target_env = _pool(_envelope(target_samples))

    # Whole-track correlation gives a reliable starting point for the first
    # window search and also catches a simple constant offset.
    corr = fftconvolve(target_env, source_env[::-1], mode="valid")
    if not len(corr):
        raise ValueError("两段音频没有足够的重叠")
    coarse_lag = int(np.argmax(np.abs(corr)))
    coarse_offset = coarse_lag / COARSE_RATE

    window = max(4, int(round(WINDOW_SECONDS * COARSE_RATE)))
    hop = max(2, int(round(HOP_SECONDS * COARSE_RATE)))
    source_pairs: list[float] = []
    target_pairs: list[float] = []
    scores: list[float] = []
    for start in range(0, max(1, len(source_env) - window + 1), hop):
        segment = source_env[start:start + window]
        if len(segment) < window:
            break
        values = _correlation_scores(target_env, segment)
        if not len(values):
            continue
        index = int(np.argmax(values))
        score = float(values[index])
        if score < 0.18:
            continue
        source_pairs.append((start + window / 2) / COARSE_RATE)
        target_pairs.append((index + window / 2) / COARSE_RATE)
        scores.append(score)

    if len(source_pairs) < 2:
        return {
            "usable": False,
            "reason": "两条音轨几乎没有可匹配的片段",
            "offset": round(coarse_offset, 3),
            "scale": 1.0,
            "confidence": 0.0,
            "anchors": [],
            "matched_windows": 0,
            "source_duration": round(source_duration, 3),
            "target_duration": round(target_duration, 3),
        }

    source = np.asarray(source_pairs, dtype=np.float64)
    target = np.asarray(target_pairs, dtype=np.float64)
    weights = np.asarray(scores, dtype=np.float64)
    slope, intercept, inliers = _robust_line(source, target, weights)
    if not (0.85 <= slope <= 1.15):
        slope, intercept = 1.0, coarse_offset
        inliers = np.ones(len(source), dtype=bool)

    selected = np.where(inliers)[0]
    # Window matches spanning a cut can land on the wrong side of the cut.
    # Keep only a monotonically increasing sequence of target times; when a
    # later match contradicts the previous one, prefer the later match.
    ordered = sorted(selected.tolist(), key=lambda i: float(source[i]))
    monotonic: list[int] = []
    for index in ordered:
        if not monotonic:
            monotonic.append(index)
            continue
        previous = monotonic[-1]
        if target[index] > target[previous] + 0.2:
            monotonic.append(index)
        elif len(monotonic) >= 2 and target[index] > target[monotonic[-2]] + 0.2:
            monotonic[-1] = index
    selected = np.asarray(monotonic, dtype=int)
    if len(selected) > 120:
        positions = np.linspace(0, len(selected) - 1, 120).astype(int)
        selected = selected[positions]

    anchors = [
        {"source": round(float(source[i]), 3), "target": round(float(target[i]), 3)}
        for i in selected
    ]
    mode = "linear"
    if len(selected) >= 3:
        predicted = slope * source[selected] + intercept
        residual = np.abs(target[selected] - predicted)
        tolerance = max(1.2, 0.005 * max(source_duration, target_duration))
        if float(np.percentile(residual, 80)) > tolerance:
            mode = "anchors"
    confidence = 0.0
    if len(selected):
        confidence = float(np.median(weights[selected]) * (len(selected) / max(1, len(source))))
    usable = confidence >= 0.12 and len(selected) >= 3 and len(source_pairs) >= 3
    reason = ""
    if not usable:
        reason = "音轨匹配度过低，可能是原视频选错、音频版本不同、静音或剪辑差异过大"
    return {
        "usable": usable,
        "reason": reason,
        "mode": mode,
        "offset": round(intercept, 3),
        "scale": round(slope, 6),
        "confidence": round(max(0.0, min(1.0, confidence)), 3),
        "anchors": anchors,
        "matched_windows": len(source_pairs),
        "inlier_windows": int(inliers.sum()),
        "source_duration": round(source_duration, 3),
        "target_duration": round(target_duration, 3),
    }
