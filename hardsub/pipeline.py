from __future__ import annotations

import io
import queue
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

import numpy as np
from PIL import Image

from .media import MediaError, extract_frame, iter_roi_frames
from .subtitles import median
from .text import (
    choose_best_text,
    clean_line,
    comparison_key,
    convert_multiline_preserving_scripts,
    is_meaningful,
    language_allowed,
    merge_text_fragments,
    similarity,
)
from .vision import VisionEngine, VisionError

ProgressFn = Callable[[float, str, str, dict], None]
LogFn = Callable[[str, str], None]
PartialFn = Callable[[list[dict]], None]

VISION_LANGUAGES = {
    "zh": ["zh-Hans", "zh-Hant"],
    "en": ["en-US"],
    "ja": ["ja-JP"],
}
LANGUAGE_LABELS = {"zh": "中文", "en": "英文", "ja": "日语"}
LEGACY_LANGUAGES = {
    "auto": ["zh", "en"],
    "hans": ["zh"],
    "hant": ["zh"],
    "zh": ["zh"],
    "zh_en": ["zh", "en"],
    "zh_ja": ["zh", "ja"],
    "en": ["en"],
    "ja": ["ja"],
}

# (frames per second scanned, seconds between OCR reads)
PRECISION = {
    "fast": (1.5, 0.67),
    "balanced": (2.0, 0.5),
    "fine": (3.0, 0.333),
}

DEFAULT_SETTINGS = {
    "roi": {"x": 0.03, "y": 0.52, "w": 0.94, "h": 0.45},
    "roi_history": [],
    "extraction_start": 0.0,
    "extraction_end": None,
    "languages": ["zh"],
    "conversion": "none",
    "precision": "balanced",
    "min_duration": 0.3,
    "confidence": 0.15,
    "scene_text_filter": True,
    "font_name": "Heiti SC",
}


class CancelledError(RuntimeError):
    pass


@dataclass
class OCRSample:
    index: int
    time: float
    width: int
    height: int
    source_height: int
    lines: list[dict] = field(default_factory=list)
    confidence: float = 0.0

    @property
    def text(self) -> str:
        return "\n".join(line["text"] for line in self.lines)


@dataclass
class Track:
    number: int
    y: float
    height: float
    last_time: float
    x: float = 0.5
    hits: list[tuple[float, dict]] = field(default_factory=list)

    @property
    def start(self) -> float:
        return self.hits[0][0]

    @property
    def end(self) -> float:
        return self.hits[-1][0]

    @property
    def text(self) -> str:
        return choose_best_text([{"text": line["text"], "confidence": line["confidence"]} for _, line in self.hits])

    @property
    def confidence(self) -> float:
        values = [line["confidence"] for _, line in self.hits if line["confidence"] > 0]
        return float(np.mean(values)) if values else 0.0

    @property
    def max_confidence(self) -> float:
        return max((line["confidence"] for _, line in self.hits), default=0.0)


def normalize_language_selection(value, legacy: str | None = None) -> list[str]:
    if isinstance(value, str):
        value = LEGACY_LANGUAGES.get(value, [value])
    if not isinstance(value, (list, tuple)):
        value = LEGACY_LANGUAGES.get(legacy or "", None) or ["zh"]
    clean = []
    for item in value:
        if isinstance(item, str) and item in VISION_LANGUAGES and item not in clean:
            clean.append(item)
    if not clean:
        clean = LEGACY_LANGUAGES.get(legacy or "", None) or ["zh"]
    return clean[:2]


def vision_languages(languages: list[str]) -> list[str]:
    result = []
    for language in languages:
        for code in VISION_LANGUAGES.get(language, []):
            if code not in result:
                result.append(code)
    return result or ["zh-Hans", "zh-Hant"]


def language_text(languages: list[str]) -> str:
    return " + ".join(LANGUAGE_LABELS.get(language, language) for language in languages)


def normalize_settings(raw: dict | None) -> dict:
    settings = dict(DEFAULT_SETTINGS)
    if raw:
        for key, value in raw.items():
            if key in settings:
                settings[key] = value
    roi = dict(DEFAULT_SETTINGS["roi"])
    if isinstance(settings.get("roi"), dict):
        for key in ("x", "y", "w", "h"):
            try:
                roi[key] = float(settings["roi"].get(key, roi[key]))
            except (TypeError, ValueError):
                pass
    roi["x"] = max(0.0, min(0.98, roi["x"]))
    roi["y"] = max(0.0, min(0.97, roi["y"]))
    roi["w"] = max(0.02, min(1.0 - roi["x"], roi["w"]))
    roi["h"] = max(0.02, min(1.0 - roi["y"], roi["h"]))
    settings["roi"] = roi
    history = []
    raw_history = settings.get("roi_history") if isinstance(settings.get("roi_history"), list) else []
    for item in raw_history:
        if not isinstance(item, dict):
            continue
        source = item.get("roi") if isinstance(item.get("roi"), dict) else item
        try:
            entry_roi = {
                "x": max(0.0, min(0.98, float(source["x"]))),
                "y": max(0.0, min(0.97, float(source["y"]))),
                "w": max(0.02, min(1.0, float(source["w"]))),
                "h": max(0.02, min(1.0, float(source["h"]))),
            }
        except (KeyError, TypeError, ValueError):
            continue
        entry_roi["w"] = min(entry_roi["w"], 1.0 - entry_roi["x"])
        entry_roi["h"] = min(entry_roi["h"], 1.0 - entry_roi["y"])
        history.append({
            "roi": entry_roi,
            "used_at": str(item.get("used_at") or ""),
            "uses": max(1, int(item.get("uses") or 1)),
            "source": str(item.get("source") or "extract")[:30],
        })
    settings["roi_history"] = history[:20]
    raw_languages = raw.get("languages") if isinstance(raw, dict) else None
    raw_legacy = raw.get("language") if isinstance(raw, dict) else None
    settings["languages"] = normalize_language_selection(raw_languages, raw_legacy)
    settings.pop("language", None)
    if settings["precision"] not in PRECISION:
        settings["precision"] = "balanced"
    if settings["conversion"] not in ("none", "simplified", "traditional", "traditional_tw"):
        settings["conversion"] = "none"
    try:
        settings["min_duration"] = max(0.05, min(10.0, float(settings["min_duration"])))
    except (TypeError, ValueError):
        settings["min_duration"] = 0.3
    try:
        settings["confidence"] = max(0.0, min(1.0, float(settings["confidence"])))
    except (TypeError, ValueError):
        settings["confidence"] = 0.15
    try:
        settings["extraction_start"] = max(0.0, float(settings.get("extraction_start") or 0.0))
    except (TypeError, ValueError):
        settings["extraction_start"] = 0.0
    raw_end = settings.get("extraction_end")
    if raw_end in (None, ""):
        settings["extraction_end"] = None
    else:
        try:
            settings["extraction_end"] = max(0.0, float(raw_end))
        except (TypeError, ValueError):
            settings["extraction_end"] = None
    scene_filter = settings.get("scene_text_filter", True)
    if isinstance(scene_filter, str):
        scene_filter = scene_filter.lower() not in ("0", "false", "no", "off", "")
    settings["scene_text_filter"] = bool(scene_filter)
    settings["font_name"] = str(settings.get("font_name") or "Heiti SC")[:80]
    return settings


def _top_left(rect: dict) -> dict:
    return {
        "x": float(rect["x"]),
        "y": 1.0 - float(rect["y"]) - float(rect["h"]),
        "w": float(rect["w"]),
        "h": float(rect["h"]),
    }


def _ocr_lines(result: dict, min_conf: float, image_h: int, languages: list[str] | None = None) -> list[dict]:
    """Group Vision observations into visual lines, top to bottom."""
    observations = []
    min_h = max(0.006, 7.0 / max(image_h, 1))
    for item in result.get("lines") or []:
        text = clean_line(item.get("text") or "")
        if not text:
            continue
        if languages and not language_allowed(text, languages):
            continue
        confidence = float(item.get("confidence") or 0)
        if confidence < min_conf:
            continue
        box = _top_left(item)
        if box["h"] < min_h:
            continue
        observations.append({
            "text": text,
            "confidence": confidence,
            "x": box["x"],
            "y": box["y"],
            "w": box["w"],
            "h": box["h"],
        })
    if not observations:
        return []

    observations.sort(key=lambda o: (o["y"], o["x"]))
    groups: list[list[dict]] = []
    for obs in observations:
        for group in groups:
            ref = group[0]
            overlap = max(0.0, min(obs["y"] + obs["h"], ref["y"] + ref["h"]) - max(obs["y"], ref["y"]))
            if overlap / max(1e-6, min(obs["h"], ref["h"])) > 0.42:
                group.append(obs)
                break
        else:
            groups.append([obs])

    lines = []
    for group in groups:
        group.sort(key=lambda o: o["x"])
        text = ""
        previous = None
        for obs in group:
            if previous is not None and text:
                gap = obs["x"] - (previous["x"] + previous["w"])
                gap_threshold = max(0.004, 0.10 * min(obs["h"], previous["h"]))
                if gap > gap_threshold:
                    # Separate OCR boxes with a visible gap usually represent a
                    # real space, not a broken-up word.
                    text = text.rstrip() + " " + obs["text"].lstrip()
                else:
                    text = merge_text_fragments(text, obs["text"])
            else:
                text = merge_text_fragments(text, obs["text"])
            previous = obs
        text = clean_line(text)
        if not text or not is_meaningful(text):
            continue
        if lines and text == lines[-1]["text"]:
            continue
        lines.append({
            "text": text,
            "confidence": float(np.mean([o["confidence"] for o in group])),
            "x": float(min(o["x"] for o in group)),
            "w": float(max(o["x"] + o["w"] for o in group) - min(o["x"] for o in group)),
            "y": float(min(o["y"] for o in group)),
            "h": float(median([o["h"] for o in group])),
        })
    lines.sort(key=lambda line: line["y"])
    return lines


def _expand_scan_roi(roi: dict) -> dict:
    """Build a generous OCR crop around the user's selection.

    Vision's Chinese recognizer is more stable when the subtitle is not flush
    against the crop edge. The scan area therefore gets a safety margin and a
    minimum height; recognized lines are later filtered back to the user's ROI.
    """
    pad_x, pad_y = 0.012, 0.032
    x = max(0.0, roi["x"] - pad_x)
    y = max(0.0, roi["y"] - pad_y)
    w = min(1.0 - x, roi["w"] + pad_x * 2)
    h = min(1.0 - y, roi["h"] + pad_y * 2)
    min_h = 0.55
    if h < min_h:
        extra = min_h - h
        y = max(0.0, y - extra / 2)
        h = min(1.0 - y, min_h)
        if h < min_h:
            y = max(0.0, 1.0 - min_h)
            h = min_h
    return {"x": x, "y": y, "w": w, "h": h}


def _lines_inside_roi(lines: list[dict], scan_roi: dict, roi: dict) -> list[dict]:
    """Drop text found in the context margin but outside the user's selection."""
    top = roi["y"] - 0.008
    bottom = roi["y"] + roi["h"] + 0.008
    left = roi["x"] - 0.015
    right = roi["x"] + roi["w"] + 0.015
    kept = []
    for line in lines:
        frame_y = scan_roi["y"] + line["y"] * scan_roi["h"]
        frame_h = line["h"] * scan_roi["h"]
        center = frame_y + frame_h / 2
        if center < top or center > bottom:
            continue
        # Normalized x within the scan crop; use the scan crop origin to map back.
        line_center_x = scan_roi["x"] + (line.get("x", 0.5) + line.get("w", 0.0) / 2) * scan_roi["w"]
        if line_center_x < left or line_center_x > right:
            continue
        kept.append(line)
    return kept


class _Extractor:
    def __init__(
        self,
        video: str,
        probe: dict,
        settings: dict,
        engine: VisionEngine,
        work_dir: Path,
        progress: ProgressFn,
        log: LogFn,
        cancel_event: threading.Event,
        partial: PartialFn | None = None,
    ):
        self.video = video
        self.probe = probe
        self.settings = settings
        self.engine = engine
        self.work_dir = work_dir
        self.progress = progress
        self.log = log
        self.cancel = cancel_event
        self.partial_cb = partial
        self.partial_cues: list[dict] = []
        self._preview_stop = threading.Event()
        self._preview_thread: threading.Thread | None = None
        self.scan_fps, self.sample_interval = PRECISION[settings["precision"]]
        self.scan_fps = min(self.scan_fps, max(0.5, probe.get("fps") or self.scan_fps))
        video_duration = max(0.1, float(probe.get("duration") or 0.0))
        self.extraction_start = max(0.0, min(video_duration - 0.05, float(settings.get("extraction_start") or 0.0)))
        requested_end = settings.get("extraction_end")
        self.extraction_end = video_duration if requested_end is None else min(
            video_duration, max(0.0, float(requested_end))
        )
        if self.extraction_end - self.extraction_start < 0.15:
            raise RuntimeError("提取结束时间必须晚于开始时间")
        self.segment_duration = self.extraction_end - self.extraction_start
        self.scan_roi = _expand_scan_roi(settings["roi"])
        source_frame_height = float(probe.get("display_height") or probe.get("height") or video_duration)
        self.source_height = max(2, int(round(source_frame_height * self.scan_roi["h"])))
        self.selected_languages = settings["languages"]
        self.languages = vision_languages(self.selected_languages)
        self.min_conf = settings["confidence"]
        self.work_dir.mkdir(parents=True, exist_ok=True)

        self.work_queue: queue.Queue = queue.Queue(maxsize=12)
        self.samples: list[OCRSample] = []
        self.errors: list[str] = []
        self.lock = threading.Lock()
        self.done = 0
        self.produced = 0
        self.total_estimate = max(1, int(round(self.segment_duration * self.scan_fps)))
        self.ocr_calls = 0
        self._last_publish = 0.0
        self._partial_published = 0

    def _check_cancel(self):
        if self.cancel.is_set():
            raise CancelledError("任务已取消")

    def _publish(self, value: float, stage: str, message: str, **stats):
        now = time.monotonic()
        if stats.get("force") or now - self._last_publish > 0.25 or value >= 0.99:
            self._last_publish = now
            stats.pop("force", None)
            self.progress(max(0.0, min(1.0, value)), stage, message, stats)

    def _scan(self):
        roi = self.scan_roi
        idx = 0
        for index, timestamp, frame, (width, height) in iter_roi_frames(
            self.video, self.probe, roi, self.scan_fps,
            start_time=self.extraction_start,
            end_time=self.extraction_end,
            upscale_small=True,
        ):
            self._check_cancel()
            image = Image.fromarray(frame)
            buffer = io.BytesIO()
            image.save(buffer, format="JPEG", quality=95, subsampling=0)
            item = (index, timestamp, buffer.getvalue(), width, height)
            while True:
                try:
                    self.work_queue.put(item, timeout=0.4)
                    break
                except queue.Full:
                    self._check_cancel()
            with self.lock:
                self.produced += 1
                self.total_estimate = max(self.produced, int(round(self.probe["duration"] * self.scan_fps)))
            idx += 1
        if idx == 0:
            raise RuntimeError("未能从视频中读取画面，请检查文件是否损坏")
        self.log(f"已抽取 {idx} 帧用于识别", "info")

    def _ocr_consumer(self):
        while True:
            item = self.work_queue.get()
            count_it = item is not None
            try:
                if item is None:
                    return
                if self.cancel.is_set():
                    continue
                index, timestamp, jpeg, width, height = item
                path = self.work_dir / f"ocr_{index:07d}.jpg"
                path.write_bytes(jpeg)
                try:
                    result = self.engine.ocr(
                        path, self.languages,
                        min_height=max(0.006, 8.0 / max(height, 1)),
                    )
                    lines = _ocr_lines(
                        result, self.min_conf, height, self.selected_languages
                    )
                    lines = _lines_inside_roi(lines, self.scan_roi, self.settings["roi"])
                    sample = OCRSample(
                        index=index, time=timestamp, width=width, height=height,
                        source_height=self.source_height,
                        lines=lines,
                        confidence=float(np.mean([line["confidence"] for line in lines])) if lines else 0.0,
                    )
                    with self.lock:
                        self.samples.append(sample)
                        self.ocr_calls += 1
                except VisionError as exc:
                    with self.lock:
                        self.errors.append(str(exc))
                finally:
                    try:
                        path.unlink(missing_ok=True)
                    except OSError:
                        pass
            except CancelledError:
                return
            except Exception as exc:
                with self.lock:
                    self.errors.append(f"识别第 {index} 帧失败：{exc}")
            finally:
                if count_it:
                    try:
                        with self.lock:
                            self.done += 1
                            done, total = self.done, max(self.total_estimate, self.done)
                        frac = done / max(1, total)
                        self._publish(
                            0.04 + 0.82 * frac, "ocr",
                            f"正在识别字幕文字（{done}/{total} 帧）",
                            done=done, total=total,
                        )
                    except Exception:
                        pass
                self.work_queue.task_done()

    def _drain_queue(self):
        while True:
            try:
                item = self.work_queue.get_nowait()
            except queue.Empty:
                break
            else:
                if item is not None:
                    self.work_queue.task_done()

    def _publish_partial(self, cues: list[dict]) -> None:
        if self.partial_cb is None:
            return
        try:
            self.partial_cb(cues)
        except Exception:
            pass

    def _preview_loop(self) -> None:
        last_published = 0
        while not self._preview_stop.is_set() and not self.cancel.is_set():
            if self._preview_stop.wait(2.5):
                return
            try:
                with self.lock:
                    samples = sorted(self.samples, key=lambda sample: sample.time)
                if len(samples) < 6:
                    continue
                cutoff = samples[-1].time - 1.5
                if cutoff - self.extraction_start < 3.0:
                    continue
                window_start = max(self.extraction_start, cutoff - 90.0)
                chunk = [sample for sample in samples if window_start <= sample.time <= cutoff]
                if len(chunk) < 4:
                    continue
                tracks = self._build_tracks(chunk)
                raw = self._tracks_to_cues(tracks, chunk)
                converted = []
                for index, cue in enumerate(raw, 1):
                    text = convert_multiline_preserving_scripts(
                        cue["text"], self.settings["conversion"]
                    ).strip()
                    if not text:
                        continue
                    converted.append({
                        "id": index,
                        "start": round(cue["start"], 3),
                        "end": round(cue["end"], 3),
                        "text": text,
                        "confidence": cue.get("confidence", 0.0),
                    })
                kept = [cue for cue in self.partial_cues if cue["end"] < window_start - 0.3]
                merged = kept + converted
                merged.sort(key=lambda cue: (cue["start"], cue["end"]))
                for index, cue in enumerate(merged, 1):
                    cue["id"] = index
                if merged and (len(merged) != self._partial_published or cutoff - last_published > 2.0):
                    self.partial_cues = merged
                    self._partial_published = len(merged)
                    last_published = cutoff
                    self._publish_partial([dict(cue) for cue in merged])
            except Exception:
                continue

    def run(self) -> dict:
        started = time.time()
        self._publish(0.03, "ocr", "正在准备识别字幕…", force=True)
        self.log(
            f"扫描 {self.scan_fps:g} fps，OCR 采样间隔约 {self.sample_interval:g}s，"
            f"语种：{language_text(self.selected_languages)}，"
            f"画面文字过滤：{'开' if self.settings['scene_text_filter'] else '关'}", "info"
        )
        self.log(f"提取范围：{_clock(self.extraction_start)} – {_clock(self.extraction_end)}", "info")
        workers = 4
        consumers = [threading.Thread(target=self._ocr_consumer, daemon=True) for _ in range(workers)]
        for thread in consumers:
            thread.start()
        if self.partial_cb is not None:
            self._preview_thread = threading.Thread(target=self._preview_loop, daemon=True)
            self._preview_thread.start()

        scan_error = None
        try:
            self._scan()
        except CancelledError:
            scan_error = "cancelled"
        except Exception as exc:
            scan_error = exc
        finally:
            if self.cancel.is_set():
                self._drain_queue()
            for _ in consumers:
                while True:
                    try:
                        self.work_queue.put(None, timeout=0.3)
                        break
                    except queue.Full:
                        if self.cancel.is_set():
                            self._drain_queue()
            for thread in consumers:
                thread.join()
        self._preview_stop.set()
        if self._preview_thread is not None:
            self._preview_thread.join(timeout=2.0)
        if scan_error == "cancelled" or self.cancel.is_set():
            raise CancelledError("任务已取消")
        if scan_error:
            raise scan_error

        with self.lock:
            samples = sorted(self.samples, key=lambda s: s.index)
            errors = list(self.errors)
            ocr_calls = self.ocr_calls
        if not samples and errors:
            raise RuntimeError(f"字幕识别失败：{errors[0]}")
        if not samples:
            raise RuntimeError("没有读到可识别的画面")

        self._publish(0.88, "build", "正在还原字幕时间轴…", force=True)
        tracks = self._build_tracks(samples)
        self.log(f"从 {len(samples)} 帧中整理出 {len(tracks)} 条文字轨迹", "info")
        cues = self._tracks_to_cues(tracks, samples)
        if not cues:
            self.log("没有识别到字幕。可以尝试扩大/移动字幕区域，或切换为精细模式。", "warn")

        line_heights = []
        final_cues = []
        for index, cue in enumerate(cues, 1):
            text = convert_multiline_preserving_scripts(
                cue["text"], self.settings["conversion"]
            ).strip()
            if not text:
                continue
            final_cues.append({
                "id": index,
                "start": round(cue["start"], 3),
                "end": round(cue["end"], 3),
                "text": text,
                "confidence": cue.get("confidence", 0.0),
            })
            if cue.get("line_height_px"):
                line_heights.append(cue["line_height_px"])

        elapsed = time.time() - started
        self._publish(0.98, "export", "正在生成字幕文件…", cues=len(final_cues), force=True)
        stats = {
            "cues": len(final_cues),
            "ocr_calls": ocr_calls,
            "chars": sum(len(c["text"]) for c in final_cues),
            "avg_confidence": round(float(np.mean([c["confidence"] for c in final_cues])), 3) if final_cues else 0,
            "elapsed": round(elapsed, 2),
            "scan_fps": self.scan_fps,
            "sample_interval": self.sample_interval,
            "line_height_px": round(median(line_heights), 2) if line_heights else 0,
            "frames": len(samples),
            "extraction_start": round(self.extraction_start, 3),
            "extraction_end": round(self.extraction_end, 3),
            "warnings": errors[:5],
        }
        return {"cues": final_cues, "stats": stats}

    def _build_tracks(self, samples: list[OCRSample]) -> list[Track]:
        tracks: list[Track] = []
        number = 0
        max_gap = max(0.55, self.sample_interval * 1.6)
        for sample in samples:
            for line in sample.lines:
                best: Track | None = None
                best_score = -1.0
                for track in tracks:
                    if sample.time - track.last_time > max_gap:
                        continue
                    if abs(track.y - line["y"]) > max(0.024, 0.8 * max(track.height, line["h"])):
                        continue
                    sim = similarity(track.text, line["text"])
                    if sim < 0.62:
                        continue
                    score = sim - abs(track.y - line["y"]) * 2.0
                    if score > best_score:
                        best_score = score
                        best = track
                if best is None:
                    number += 1
                    best = Track(
                        number=number, y=line["y"], height=line["h"],
                        last_time=sample.time,
                        x=line["x"] + line["w"] / 2,
                    )
                    tracks.append(best)
                count = len(best.hits)
                best.y = (best.y * count + line["y"]) / (count + 1)
                best.height = (best.height * count + line["h"]) / (count + 1)
                best.x = (best.x * count + line["x"] + line["w"] / 2) / (count + 1)
                best.last_time = sample.time
                best.hits.append((sample.time, line))
        return tracks

    def _filter_scene_text(self, tracks: list[Track]) -> list[Track]:
        """Keep tracks whose vertical position behaves like a subtitle band.

        Scene text (shop signs, watermarks, UI labels) usually sits in a
        different band or in a much larger/smaller font. Hard subtitles tend to
        occupy one or two stable bands, so clusters with very little support are
        discarded. Tight user selections skip this heuristic to avoid surprises.
        """
        if not self.settings.get("scene_text_filter", True):
            return tracks
        if len(tracks) < 3 or self.settings["roi"]["h"] < 0.24:
            return tracks

        clusters: list[dict] = []
        for track in sorted(tracks, key=lambda item: item.y + item.height / 2):
            cy = track.y + track.height / 2
            for cluster in clusters:
                tolerance = max(0.022, 0.55 * max(track.height, cluster["height"]))
                if abs(cy - cluster["cy"]) <= tolerance:
                    break
            else:
                cluster = {"cy": cy, "height": track.height, "tracks": []}
                clusters.append(cluster)
            count = len(cluster["tracks"])
            cluster["cy"] = (cluster["cy"] * count + cy) / (count + 1)
            cluster["height"] = (cluster["height"] * count + track.height) / (count + 1)
            cluster["tracks"].append(track)

        for cluster in clusters:
            cluster["score"] = sum(
                min(len(track.hits), 8) * (0.6 + min(track.confidence, 1.0))
                for track in cluster["tracks"]
            )
        top_score = max((cluster["score"] for cluster in clusters), default=0.0)
        if top_score <= 0:
            return tracks
        keep_clusters = [
            cluster for cluster in clusters
            if cluster["score"] >= max(1.6, top_score * 0.10)
        ]
        keep_clusters.sort(key=lambda cluster: cluster["score"], reverse=True)
        keep_clusters = keep_clusters[:3]
        keep_ids = {track.number for cluster in keep_clusters for track in cluster["tracks"]}
        filtered = [track for track in tracks if track.number in keep_ids]

        # Drop obvious scene text: off-centre low-confidence tracks at the edge.
        centred = [
            track for track in filtered
            if not (
                track.confidence < 0.55
                and not (
                    0.10 <= self.scan_roi["x"] + track.x * self.scan_roi["w"] <= 0.90
                )
            )
        ]
        if centred:
            filtered = centred

        heights = [track.height for track in filtered]
        if heights:
            middle = median(heights)
            sized = [
                track for track in filtered
                if 0.42 * middle <= track.height <= 2.4 * middle
            ]
            if sized:
                filtered = sized

        if 0 < len(filtered) < len(tracks):
            self.log(f"画面文字过滤：保留 {len(filtered)}/{len(tracks)} 条轨迹", "info")
        return filtered

    def _tracks_to_cues(self, tracks: list[Track], samples: list[OCRSample]) -> list[dict]:
        interval = self.sample_interval
        duration = self.extraction_end
        tracks = self._filter_scene_text(tracks)
        kept: list[dict] = []
        for track in tracks:
            text = track.text
            if not text or not is_meaningful(text):
                continue
            key = comparison_key(text)
            if len(key) <= 1 and track.max_confidence < 0.8:
                continue
            if track.confidence < 0.34 and track.max_confidence < 0.7:
                lead = text.lstrip()[:1]
                # Low-contrast coloured subtitles often sit at ~0.3. Keep them
                # when they are plausible dialogue; discard one-off graphic noise.
                if len(key) < 2 or lead in "，。！？；：、…" or len(track.hits) < 3:
                    continue
            span = track.end - track.start
            if len(track.hits) < 2 and track.max_confidence < 0.7:
                continue
            if len(track.hits) < 2 and len(text) < 2:
                continue
            if span + interval < 0.35:
                continue
            start = max(self.extraction_start, track.start - interval * 0.25)
            # The last OCR hit is usually one sample before the subtitle
            # disappears. Extending by a full sample keeps cues from ending
            # early, which is perceived as the timeline running fast.
            end = min(duration, track.end + interval)
            if end - start > (18.0 if self.settings.get("scene_text_filter", True) else 20.0):
                continue
            heights = [line["h"] * samples[0].source_height for _, line in track.hits]
            kept.append({
                "start": start,
                "end": end,
                "text": text,
                "confidence": track.confidence,
                "line_height_px": median(heights),
                "y": track.y,
                "height": track.height,
            })

        kept.sort(key=lambda c: (c["start"], c["y"]))
        merged: list[dict] = []
        gap_limit = max(0.55, interval * 1.8)
        duplicate_limit = max(0.5, interval * 1.5)
        for cue in kept:
            target = None
            duplicate = False
            for existing in merged:
                overlap = min(existing["end"], cue["end"]) - max(existing["start"], cue["start"])
                shortest = min(existing["end"] - existing["start"], cue["end"] - cue["start"])
                overlap_ratio = overlap / shortest if shortest > 0 else 0.0
                gap = max(0.0, cue["start"] - existing["end"], existing["start"] - cue["end"])
                bands = existing.get("bands") or [(existing["y"], existing["height"])]
                same_band = any(
                    abs(cue["y"] - band_y) < max(0.02, 0.45 * min(cue["height"], band_h))
                    for band_y, band_h in bands
                )
                if same_band:
                    # Compare against the individual line at this band; the
                    # cue may already contain a bilingual/stacked second line.
                    line_similar = max(
                        (
                            similarity(line_text, cue["text"])
                            for line_y, line_text, _ in existing["lines"]
                            if abs(line_y - cue["y"]) < max(0.02, 0.45 * min(cue["height"], existing["height"]))
                        ),
                        default=0.0,
                    )
                    # Same vertical line: merge overlapping duplicate OCR
                    # tracks, plus a short trailing fragment of the same line.
                    overlapping_duplicate = overlap_ratio > 0.22 and line_similar >= 0.60
                    short_fragment = (
                        line_similar >= 0.72
                        and gap <= max(0.2, interval * 0.6)
                        and min(existing["end"] - existing["start"], cue["end"] - cue["start"]) <= 1.0
                    )
                    if (not overlapping_duplicate and not short_fragment) or gap > duplicate_limit:
                        continue
                    duplicate = True
                else:
                    # Different vertical bands: stacked/bilingual lines often
                    # start or end one OCR sample apart. Merge those, but do
                    # not bridge unrelated cues with a long gap.
                    if overlap_ratio <= 0.30 and gap > gap_limit:
                        continue
                    if max(existing["end"], cue["end"]) - min(existing["start"], cue["start"]) > 12.0:
                        continue
                    duplicate = False
                target = existing
                break
            if target is None:
                merged.append(dict(
                    cue,
                    lines=[(cue["y"], cue["text"], cue["confidence"])],
                    bands=[(cue["y"], cue["height"])],
                ))
                continue

            target["start"] = min(target["start"], cue["start"])
            target["end"] = max(target["end"], cue["end"])
            target["confidence"] = max(target["confidence"], cue["confidence"])
            target["line_height_px"] = max(target["line_height_px"], cue["line_height_px"])
            if duplicate:
                # Replace the closest existing line with the better OCR read.
                best_index = min(
                    range(len(target["lines"])),
                    key=lambda i: abs(target["lines"][i][0] - cue["y"]),
                )
                old_y, old_text, old_conf = target["lines"][best_index]
                target["lines"][best_index] = (
                    old_y,
                    choose_best_text([
                        {"text": old_text, "confidence": old_conf},
                        {"text": cue["text"], "confidence": cue["confidence"]},
                    ]),
                    max(old_conf, cue["confidence"]),
                )
            else:
                target["lines"].append((cue["y"], cue["text"], cue["confidence"]))
                target["bands"].append((cue["y"], cue["height"]))

        for cue in merged:
            line_entries = []
            for y, text, confidence in sorted(cue.pop("lines"), key=lambda item: item[0]):
                for line in text.split("\n"):
                    line = line.strip()
                    if not line:
                        continue
                    replaced = False
                    for index, (old_line, old_conf) in enumerate(line_entries):
                        if similarity(old_line, line) >= 0.78:
                            # Prefer the cleaner variant when OCR adds a stray
                            # trailing digit to an otherwise identical line.
                            ka, kb = comparison_key(old_line), comparison_key(line)
                            if len(ka) == len(kb) + 1 and ka.startswith(kb) and ka[-1].isdigit():
                                line_entries[index] = (old_line, max(old_conf, confidence))
                            elif len(kb) == len(ka) + 1 and kb.startswith(ka) and kb[-1].isdigit():
                                line_entries[index] = (line, max(old_conf, confidence))
                            else:
                                line_entries[index] = (
                                    choose_best_text([
                                        {"text": old_line, "confidence": old_conf},
                                        {"text": line, "confidence": confidence},
                                    ]),
                                    max(old_conf, confidence),
                                )
                            replaced = True
                            break
                    if not replaced:
                        line_entries.append((line, confidence))
            cue["text"] = "\n".join(line for line, _ in line_entries)
            cue.pop("bands", None)
            cue.pop("y", None)
            cue.pop("height", None)

        # Merge duplicate tracks split by a single missed OCR frame.
        merged.sort(key=lambda c: c["start"])
        cleaned: list[dict] = []
        for cue in merged:
            if cleaned:
                previous = cleaned[-1]
                gap = cue["start"] - previous["end"]
                if gap <= 0.45 and similarity(previous["text"], cue["text"]) >= 0.92:
                    previous["end"] = max(previous["end"], cue["end"])
                    if len(cue["text"]) > len(previous["text"]):
                        previous["text"] = cue["text"]
                    previous["confidence"] = max(previous["confidence"], cue["confidence"])
                    previous["line_height_px"] = max(previous["line_height_px"], cue["line_height_px"])
                    continue
            cleaned.append(cue)

        cleaned.sort(key=lambda c: c["start"])
        for i in range(len(cleaned) - 1):
            current, nxt = cleaned[i], cleaned[i + 1]
            if current["end"] > nxt["start"] + 0.04:
                boundary = (current["end"] + nxt["start"]) / 2
                current["end"] = max(current["start"] + 0.08, boundary - 0.01)
                nxt["start"] = min(nxt["end"] - 0.08, boundary + 0.01)
            elif 0.03 < nxt["start"] - current["end"] < 0.7:
                # OCR occasionally misses the last frame of a cue. Close small
                # detection gaps to the midpoint instead of leaving dead air.
                boundary = (current["end"] + nxt["start"]) / 2
                current["end"] = boundary - 0.005
                nxt["start"] = boundary + 0.005
        result = []
        for cue in cleaned:
            if cue["end"] - cue["start"] < self.settings["min_duration"]:
                cue["end"] = min(duration, cue["start"] + self.settings["min_duration"])
        for i in range(len(cleaned) - 1):
            current, nxt = cleaned[i], cleaned[i + 1]
            if current["end"] > nxt["start"] + 0.04:
                boundary = (current["end"] + nxt["start"]) / 2
                current["end"] = max(current["start"] + 0.08, boundary - 0.01)
                nxt["start"] = min(nxt["end"] - 0.08, boundary + 0.01)
        for cue in cleaned:
            if cue["end"] - cue["start"] >= 0.12:
                result.append(cue)
        return result


def _clock(seconds: float) -> str:
    seconds = max(0, int(seconds))
    hours, rem = divmod(seconds, 3600)
    minutes, secs = divmod(rem, 60)
    if hours:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def run_extraction(
    video: str,
    probe: dict,
    raw_settings: dict,
    work_dir: str | Path,
    progress: ProgressFn,
    log: LogFn,
    cancel_event: threading.Event,
    ocr_workers: int = 4,
    partial: PartialFn | None = None,
) -> dict:
    settings = normalize_settings(raw_settings)
    engine = VisionEngine(ocr_workers=ocr_workers)
    try:
        extractor = _Extractor(
            video, probe, settings, engine, Path(work_dir),
            progress, log, cancel_event, partial,
        )
        result = extractor.run()
        result["settings"] = settings
        return result
    finally:
        engine.close()


def detect_region(
    video: str,
    probe: dict,
    work_dir: str | Path,
    engine: VisionEngine | None = None,
    languages: list[str] | str | None = None,
    start_time: float | None = None,
    end_time: float | None = None,
) -> dict:
    """Find a likely subtitle band by OCR-ing sample frames across the video."""
    selected_languages = normalize_language_selection(languages)
    selected_vision_languages = vision_languages(selected_languages)
    own_engine = engine is None
    engine = engine or VisionEngine(ocr_workers=1)
    work = Path(work_dir)
    work.mkdir(parents=True, exist_ok=True)
    duration = max(0.1, probe["duration"])
    range_start = max(0.0, min(duration - 0.1, float(start_time or 0.0)))
    range_end = duration if end_time is None else max(range_start + 0.1, min(duration, float(end_time)))
    height = probe["display_height"]
    boxes: list[dict] = []
    try:
        fractions = [0.05, 0.15, 0.26, 0.37, 0.49, 0.6, 0.71, 0.82, 0.93]
        for i, fraction in enumerate(fractions):
            timestamp = range_start + (range_end - range_start) * fraction
            timestamp = max(range_start + 0.05, min(range_end - 0.05, timestamp))
            path = work / f"auto_{i}.jpg"
            try:
                extract_frame(video, timestamp, path, max_width=1280)
                result = engine.ocr(
                    path, selected_vision_languages,
                    min_height=max(0.006, 9.0 / max(height, 1)),
                )
            except (MediaError, VisionError):
                continue
            for item in result.get("lines") or []:
                text = clean_line(item.get("text") or "")
                if not text or not is_meaningful(text):
                    continue
                if not language_allowed(text, selected_languages):
                    continue
                if float(item.get("confidence") or 0) < 0.3:
                    continue
                box = _top_left(item)
                if box["h"] < max(0.008, 10.0 / max(height, 1)):
                    continue
                if box["y"] < 0.2 or box["y"] + box["h"] > 0.995:
                    continue
                if box["h"] > 0.32 or box["w"] < 0.012:
                    continue
                box["text"] = text
                box["confidence"] = float(item.get("confidence") or 0)
                box["sample"] = i
                boxes.append(box)
    finally:
        if own_engine:
            engine.close()

    if not boxes:
        return {
            "roi": {"x": 0.03, "y": 0.52, "w": 0.94, "h": 0.45},
            "method": "fallback", "lines": 0,
        }

    boxes.sort(key=lambda b: b["y"] + b["h"] / 2)
    clusters: list[dict] = []
    for box in boxes:
        cy = box["y"] + box["h"] / 2
        target = None
        for cluster in clusters:
            if abs(cy - cluster["cy"]) <= 0.045:
                target = cluster
                break
        if target is None:
            target = {"cy": cy, "count": 0, "score": 0.0, "boxes": []}
            clusters.append(target)
        target["count"] += 1
        target["cy"] = (target["cy"] * (target["count"] - 1) + cy) / target["count"]
        target["score"] += 1.0 + cy * 1.2 + (1.0 if len(box["text"]) >= 2 else 0)
        target["boxes"].append(box)

    clusters.sort(key=lambda c: (c["score"], c["cy"]), reverse=True)
    chosen = clusters[0]
    selected = list(chosen["boxes"])
    selected_samples = {b["sample"] for b in selected}
    # Bilingual subtitles often sit 8–20% apart. If another text band appears in
    # the same sampled frames, include it so both languages are captured.
    for cluster in clusters[1:]:
        if abs(cluster["cy"] - chosen["cy"]) > 0.24:
            continue
        cx1 = min(b["x"] for b in cluster["boxes"])
        cx2 = max(b["x"] + b["w"] for b in cluster["boxes"])
        if (cx1 + cx2) / 2 < 0.12 or (cx1 + cx2) / 2 > 0.88:
            continue
        shares_frame = bool({b["sample"] for b in cluster["boxes"]} & selected_samples)
        # Bilingual lines may be visible at only one sampled timestamp, so a
        # nearby centered band is enough to include it.
        if not shares_frame and cluster["count"] < 2:
            continue
        selected.extend(cluster["boxes"])
        selected_samples |= {b["sample"] for b in cluster["boxes"]}
    xs1 = min(b["x"] for b in selected)
    ys1 = min(b["y"] for b in selected)
    xs2 = max(b["x"] + b["w"] for b in selected)
    ys2 = max(b["y"] + b["h"] for b in selected)
    pad_x, pad_y = 0.018, 0.02
    x = max(0.0, xs1 - pad_x)
    y = max(0.0, ys1 - pad_y)
    roi = {
        "x": round(x, 4),
        "y": round(y, 4),
        "w": round(min(1.0 - x, xs2 - xs1 + pad_x * 2), 4),
        "h": round(min(1.0 - y, max(0.065, ys2 - ys1 + pad_y * 2)), 4),
    }
    return {"roi": roi, "method": "ocr", "lines": len(selected), "samples": len(boxes)}
