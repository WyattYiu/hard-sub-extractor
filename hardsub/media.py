from __future__ import annotations

import json
import os
import shutil
import subprocess
from fractions import Fraction
from pathlib import Path


class MediaError(RuntimeError):
    pass


def _tool(name: str) -> str:
    env = os.environ.get(name.upper())
    if env and Path(env).exists():
        return env
    found = shutil.which(name)
    if found:
        return found
    home = Path.home()
    for candidate in (
        home / "ffmpeg" / "bin" / name,
        Path("/opt/homebrew/bin") / name,
        Path("/usr/local/bin") / name,
    ):
        if candidate.exists():
            return str(candidate)
    raise MediaError(f"找不到 {name}。请先安装 ffmpeg（brew install ffmpeg）。")


FFMPEG = None
FFPROBE = None


def ensure_media_tools() -> tuple[str, str]:
    global FFMPEG, FFPROBE
    if not FFMPEG:
        FFMPEG = _tool("ffmpeg")
    if not FFPROBE:
        FFPROBE = _tool("ffprobe")
    return FFMPEG, FFPROBE


def _fraction(value: str | None, default: float = 25.0) -> float:
    if not value or value in ("0/0", "N/A"):
        return default
    try:
        number = float(Fraction(value))
        return number if number > 0 and number < 1000 else default
    except Exception:
        try:
            return float(value)
        except Exception:
            return default


def probe_video(path: str | Path) -> dict:
    _, ffprobe = ensure_media_tools()
    cmd = [
        ffprobe, "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", str(path),
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if proc.returncode != 0:
        raise MediaError(f"无法读取视频信息：{proc.stderr.strip()[:400]}")
    try:
        info = json.loads(proc.stdout)
    except json.JSONDecodeError as exc:
        raise MediaError("ffprobe 返回了无法解析的数据") from exc

    streams = info.get("streams") or []
    video = next((s for s in streams if s.get("codec_type") == "video"), None)
    if not video:
        raise MediaError("这个文件里没有视频轨道")

    fmt = info.get("format") or {}
    duration = 0.0
    for candidate in (fmt.get("duration"), video.get("duration")):
        try:
            duration = float(candidate)
            if duration > 0:
                break
        except (TypeError, ValueError):
            continue

    width = int(video.get("width") or 0)
    height = int(video.get("height") or 0)
    rotation = 0.0
    for side in video.get("side_data_list") or []:
        if "rotation" in side:
            try:
                rotation = float(side["rotation"])
            except (TypeError, ValueError):
                pass
    tags = video.get("tags") or {}
    if not rotation and tags.get("rotate"):
        try:
            rotation = float(tags["rotate"])
        except (TypeError, ValueError):
            pass
    if abs(round(rotation)) % 180 == 90:
        display_width, display_height = height, width
    else:
        display_width, display_height = width, height

    fps = _fraction(video.get("avg_frame_rate")) or _fraction(video.get("r_frame_rate"))
    audio = next((s for s in streams if s.get("codec_type") == "audio"), None)
    size = 0
    try:
        size = int(fmt.get("size") or 0)
    except (TypeError, ValueError):
        pass
    if not size:
        try:
            size = Path(path).stat().st_size
        except OSError:
            size = 0

    return {
        "width": width,
        "height": height,
        "display_width": display_width,
        "display_height": display_height,
        "duration": round(duration, 3),
        "fps": round(fps, 3),
        "rotation": rotation,
        "codec": video.get("codec_name") or "unknown",
        "format": fmt.get("format_name") or "",
        "size": size,
        "bit_rate": int(fmt.get("bit_rate") or 0) if str(fmt.get("bit_rate") or "0").isdigit() else 0,
        "has_audio": audio is not None,
        "audio_codec": (audio or {}).get("codec_name") or "",
    }


def extract_frame(
    video: str | Path,
    timestamp: float,
    output: str | Path,
    *,
    max_width: int | None = 1280,
    crop: tuple[int, int, int, int] | None = None,
) -> str:
    ffmpeg, _ = ensure_media_tools()
    filters = []
    if crop:
        x, y, w, h = crop
        filters.append(f"crop={w}:{h}:{x}:{y}")
    if max_width:
        filters.append(f"scale='min({max_width},iw)':-2")
    cmd = [
        ffmpeg, "-v", "error", "-nostdin", "-y",
        "-ss", f"{max(0.0, timestamp):.3f}", "-i", str(video),
        "-frames:v", "1",
    ]
    if filters:
        cmd += ["-vf", ",".join(filters)]
    cmd += ["-q:v", "2", str(output)]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if proc.returncode != 0 or not Path(output).exists():
        raise MediaError(f"抽帧失败：{proc.stderr.strip()[:400]}")
    return str(output)


def make_poster(video: str | Path, duration: float, output: str | Path) -> str:
    ts = min(max(duration * 0.18, 1.0), max(duration - 0.1, 0.0))
    return extract_frame(video, ts, output, max_width=1280)


def iter_roi_frames(
    video: str | Path,
    probe: dict,
    roi: dict,
    fps: float,
    *,
    target_width: int = 1280,
    start_time: float = 0.0,
    end_time: float | None = None,
    upscale_small: bool = False,
):
    """Yield (index, timestamp, RGB ndarray) for a cropped, downscaled ROI.

    This is a generator over ffmpeg's rawvideo pipe, so a feature film never has
    to be materialized as thousands of image files.
    """
    import numpy as np

    ffmpeg, _ = ensure_media_tools()
    vw, vh = probe["display_width"], probe["display_height"]
    x = int(round(max(0.0, min(1.0, roi["x"])) * vw))
    y = int(round(max(0.0, min(1.0, roi["y"])) * vh))
    w = int(round(max(0.01, min(1.0 - roi["x"], roi["w"])) * vw))
    h = int(round(max(0.01, min(1.0 - roi["y"], roi["h"])) * vh))
    x = max(0, min(vw - 2, x))
    y = max(0, min(vh - 2, y))
    w = max(2, min(vw - x, w))
    h = max(2, min(vh - y, h))
    # libx264/rawvideo crops are happiest with even dimensions.
    w -= w % 2
    h -= h % 2
    if w < 16 or h < 16:
        raise MediaError("字幕区域太小，请重新框选")

    if upscale_small and w < 1000:
        out_w = min(1920, w * 3)
    else:
        out_w = min(target_width, w)
    out_w -= out_w % 2
    out_h = max(2, int(round(h * out_w / w)))
    out_h -= out_h % 2

    vf = f"fps={fps},crop={w}:{h}:{x}:{y},scale={out_w}:{out_h}"
    start_time = max(0.0, float(start_time or 0.0))
    if end_time is not None and float(end_time) <= start_time:
        raise MediaError("提取结束时间必须晚于开始时间")
    cmd = [ffmpeg, "-v", "error", "-nostdin"]
    if start_time > 0:
        cmd += ["-ss", f"{start_time:.3f}"]
    cmd += ["-i", str(video)]
    if end_time is not None:
        cmd += ["-t", f"{max(0.05, float(end_time) - start_time):.3f}"]
    cmd += ["-vf", vf, "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"]
    proc = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=1024 * 1024
    )
    frame_bytes = out_w * out_h * 3

    def drain():
        try:
            for _ in proc.stderr:
                pass
        except Exception:
            pass

    import threading

    err_thread = threading.Thread(target=drain, daemon=True)
    err_thread.start()

    index = 0
    try:
        while True:
            buf = bytearray(frame_bytes)
            view = memoryview(buf)
            filled = 0
            while filled < frame_bytes:
                chunk = proc.stdout.read(frame_bytes - filled)
                if not chunk:
                    break
                view[filled:filled + len(chunk)] = chunk
                filled += len(chunk)
            if filled < frame_bytes:
                break
            frame = np.frombuffer(buf, dtype=np.uint8).reshape((out_h, out_w, 3))
            yield index, start_time + index / fps, frame, (out_w, out_h)
            index += 1
    finally:
        try:
            proc.kill()
        except Exception:
            pass
        try:
            proc.wait(timeout=5)
        except Exception:
            pass
