from __future__ import annotations

import argparse
import json
import queue
import re
import shutil
import socket
import subprocess
import tempfile
import threading
import time
import uuid
import webbrowser
from pathlib import Path
from urllib.parse import quote

from flask import Flask, Response, jsonify, request, send_file, send_from_directory, stream_with_context
from werkzeug.exceptions import RequestEntityTooLarge

from hardsub.jobs import BusyError, JobError, JobManager, subtitle_response
from hardsub.paths import OCR_BINARY, STATIC_DIR
from hardsub.media import ensure_media_tools, MediaError, probe_video
from hardsub.audio_sync import align_audio

app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path="/static")
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024 * 1024
app.config["JSON_AS_ASCII"] = False
manager = JobManager()
PROXIES_DIR = manager.jobs_dir.parent / "proxies"
PROXIES_DIR.mkdir(parents=True, exist_ok=True)
MUX_DIR = manager.jobs_dir.parent / "mux"
MUX_DIR.mkdir(parents=True, exist_ok=True)
MUX_JOBS: dict[str, dict] = {}
MUX_LOCK = threading.Lock()
CUT_DIR = manager.jobs_dir.parent / "cut"
CUT_DIR.mkdir(parents=True, exist_ok=True)
CUT_JOBS: dict[str, dict] = {}
CUT_LOCK = threading.Lock()


def _error(message: str, status: int = 400):
    return jsonify({"error": message}), status


@app.errorhandler(RequestEntityTooLarge)
def too_large(_exc):
    return _error("文件太大，浏览器上传上限为 32 GB", 413)


@app.errorhandler(MediaError)
def media_error(exc):
    return _error(str(exc), 400)


@app.errorhandler(JobError)
def job_error(exc):
    return _error(str(exc), 409 if isinstance(exc, BusyError) else 400)


@app.get("/")
def index():
    return send_from_directory(STATIC_DIR, "index.html")


@app.get("/api/health")
def health():
    try:
        ffmpeg, ffprobe = ensure_media_tools()
        tools_ok = True
    except MediaError:
        ffmpeg = ffprobe = ""
        tools_ok = False
    return jsonify({
        "ok": tools_ok and OCR_BINARY.exists(),
        "ffmpeg": ffmpeg,
        "ffprobe": ffprobe,
        "vision": OCR_BINARY.exists(),
        "version": "1.7.0",
    })


@app.get("/api/jobs")
def list_jobs():
    return jsonify({"jobs": manager.list()})


@app.post("/api/jobs")
def create_job():
    upload = request.files.get("video")
    if upload is None:
        return _error("没有收到视频文件")
    if not upload.filename:
        return _error("文件名无效")
    job = manager.create(upload, request.form.get("name") or upload.filename)
    return jsonify(job.to_dict(include_cues=True)), 201


def _make_proxy(source: Path, destination: Path) -> dict:
    ffmpeg, _ = ensure_media_tools()
    info = probe_video(source)
    video_codec = (info.get("codec") or "").lower()
    audio_codec = (info.get("audio_codec") or "").lower()
    command = [ffmpeg, "-y", "-v", "error", "-i", str(source)]
    if video_codec == "h264":
        command += ["-c:v", "copy"]
    else:
        command += [
            "-vf", "scale='min(1280,iw)':-2",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
            "-pix_fmt", "yuv420p",
        ]
    if not audio_codec:
        command += ["-an"]
    elif audio_codec in ("aac", "mp3"):
        command += ["-c:a", "copy"]
    else:
        command += ["-c:a", "aac", "-b:a", "128k"]
    command += ["-movflags", "+faststart", str(destination)]
    process = subprocess.run(command, capture_output=True, text=True, timeout=3600)
    if process.returncode != 0:
        detail = process.stderr.strip().splitlines()
        raise ValueError(detail[-1] if detail else "转码失败")
    return info


@app.post("/api/transcode")
def transcode_for_browser():
    upload = request.files.get("video")
    if upload is None or not upload.filename:
        return _error("没有收到视频文件")
    suffix = Path(upload.filename).suffix.lower() or ".mp4"
    token = uuid.uuid4().hex[:16]
    temp_path = Path(tempfile.gettempdir()) / f"hardsub-proxy-src-{token}{suffix}"
    destination = PROXIES_DIR / f"{token}.mp4"
    try:
        upload.save(str(temp_path))
        _make_proxy(temp_path, destination)
        cutoff = time.time() - 86400
        for stale in PROXIES_DIR.glob("*.mp4"):
            try:
                if stale.stat().st_mtime < cutoff:
                    stale.unlink()
            except OSError:
                pass
        return jsonify({
            "url": f"/api/transcode/{token}",
            "name": upload.filename,
        })
    except ValueError as exc:
        return _error(f"生成兼容预览失败：{exc}", 400)
    except Exception as exc:
        return _error(f"生成兼容预览失败：{exc}", 500)
    finally:
        try:
            temp_path.unlink(missing_ok=True)
        except OSError:
            pass


@app.get("/api/transcode/<token>")
def transcode_video(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的预览地址", 404)
    path = PROXIES_DIR / f"{token}.mp4"
    if not path.exists():
        return _error("兼容预览不存在或已过期", 404)
    response = send_file(path, conditional=True, as_attachment=False)
    response.headers["Accept-Ranges"] = "bytes"
    return response


def _safe_filename(value: str, fallback: str = "output") -> str:
    name = Path(value or "").name
    name = re.sub(r"[\\/:*?\"<>|\x00-\x1f]", "_", name).strip(" .")
    return name or fallback


def _mux_progress_seconds(value: str) -> float:
    try:
        if ":" in value:
            hours, minutes, seconds = value.split(":")
            return int(hours) * 3600 + int(minutes) * 60 + float(seconds)
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _run_mux_job(token: str) -> None:
    job = MUX_JOBS.get(token)
    if not job:
        return
    try:
        job["stage"] = "muxing"
        job["progress"] = 0.0
        job["message"] = "正在封装，视频和音频不重新编码…"
        ffmpeg, _ = ensure_media_tools()
        command = [
            ffmpeg, "-y", "-v", "error", "-progress", "pipe:1", "-nostats",
            "-i", str(job["video_path"]), "-i", str(job["subtitle_path"]),
            "-map", "0:v:0", "-map", "0:a?", "-map", "1:s:0",
            "-map_chapters", "0",
            "-c", "copy",
            "-metadata:s:s:0", f"language={job['language']}",
        ]
        if job["title"]:
            command += ["-metadata:s:s:0", f"title={job['title']}"]
        command += ["-disposition:s:0", "default" if job["is_default"] else "0"]
        command += ["-f", "matroska", str(job["output_path"])]
        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, bufsize=1,
        )
        progress_value = 0.0
        duration = float(job.get("duration") or 0.0)
        if process.stdout is not None:
            for line in process.stdout:
                line = line.strip()
                if line.startswith("out_time_us="):
                    value = line.split("=", 1)[1]
                    try:
                        seconds = float(value) / 1_000_000
                    except ValueError:
                        seconds = 0.0
                    if seconds > 0:
                        if duration > 0:
                            progress_value = min(0.98, seconds / duration)
                            job["progress"] = round(progress_value, 3)
                elif line.startswith("out_time="):
                    seconds = _mux_progress_seconds(line.split("=", 1)[1])
                    if seconds > 0:
                        if duration > 0:
                            job["progress"] = round(min(0.98, seconds / duration), 3)
                elif line.startswith("progress=") and line.endswith("end"):
                    job["progress"] = 0.99
        code = process.wait(timeout=30)
        if code != 0:
            raise ValueError("ffmpeg 封装失败")
        info = probe_video(job["output_path"])
        result = {
            "url": f"/api/mux/{token}/download",
            "filename": job["output_name"],
            "size": job["output_path"].stat().st_size,
            "duration": info.get("duration", 0),
            "video_codec": info.get("codec", ""),
            "audio_codec": info.get("audio_codec", ""),
        }
        (job["work_dir"] / "info.json").write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
        job["result"] = result
        job["progress"] = 1.0
        job["stage"] = "done"
        job["message"] = "封装完成"
    except Exception as exc:
        job["stage"] = "error"
        job["error"] = str(exc)
        job["message"] = f"封装失败：{exc}"
    finally:
        job["updated_at"] = time.time()


@app.post("/api/mux")
def mux_video():
    video = request.files.get("video")
    subtitle = request.files.get("subtitle")
    if video is None or not video.filename:
        return _error("没有收到视频文件")
    if subtitle is None or not subtitle.filename:
        return _error("没有收到字幕文件")
    subtitle_suffix = Path(subtitle.filename).suffix.lower()
    if subtitle_suffix not in (".srt", ".ass", ".ssa"):
        return _error("字幕只支持 SRT / ASS / SSA")
    token = uuid.uuid4().hex[:16]
    work_dir = MUX_DIR / token
    work_dir.mkdir(parents=True, exist_ok=True)
    video_suffix = Path(video.filename).suffix.lower() or ".mp4"
    video_path = work_dir / f"input{video_suffix}"
    subtitle_path = work_dir / f"subtitle{subtitle_suffix}"
    output_path = work_dir / "output.mkv"
    try:
        video.save(str(video_path))
        subtitle.save(str(subtitle_path))
        info = probe_video(video_path)
        language = (request.form.get("language") or "chi").lower()
        language = language if language in {"chi", "eng", "jpn", "kor", "und"} else "und"
        title = (request.form.get("title") or "").strip()[:100]
        is_default = (request.form.get("default") or "1").lower() not in ("0", "false", "no")
        output_name = f"{Path(_safe_filename(video.filename, 'output')).stem}.mkv"
        with MUX_LOCK:
            MUX_JOBS[token] = {
                "token": token,
                "work_dir": work_dir,
                "video_path": video_path,
                "subtitle_path": subtitle_path,
                "output_path": output_path,
                "output_name": output_name,
                "language": language,
                "title": title,
                "is_default": is_default,
                "duration": info.get("duration", 0),
                "stage": "queued",
                "progress": 0.0,
                "message": "准备封装…",
                "error": "",
                "result": None,
                "updated_at": time.time(),
            }
        thread = threading.Thread(target=_run_mux_job, args=(token,), daemon=True)
        thread.start()
        cutoff = time.time() - 86400
        for stale in MUX_DIR.iterdir():
            if stale.is_dir() and stale.name != token:
                try:
                    if stale.stat().st_mtime < cutoff:
                        shutil.rmtree(stale, ignore_errors=True)
                except OSError:
                    pass
        return jsonify({
            "token": token,
            "status_url": f"/api/mux/{token}/status",
            "download_url": f"/api/mux/{token}/download",
        })
    except Exception as exc:
        shutil.rmtree(work_dir, ignore_errors=True)
        return _error(f"封装失败：{exc}", 500)


@app.get("/api/mux/<token>/status")
def mux_status(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的封装任务", 404)
    job = MUX_JOBS.get(token)
    if job is None:
        output = MUX_DIR / token / "output.mkv"
        info_path = MUX_DIR / token / "info.json"
        if output.exists() and info_path.exists():
            try:
                result = json.loads(info_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                result = None
            return jsonify({"stage": "done", "progress": 1.0, "message": "封装完成", "result": result})
        return _error("封装任务不存在或已过期", 404)
    return jsonify({
        "stage": job["stage"],
        "progress": job["progress"],
        "message": job["message"],
        "error": job["error"],
        "result": job["result"],
    })


def _first_subtitle_codec(path: Path) -> str:
    _, ffprobe = ensure_media_tools()
    process = subprocess.run(
        [ffprobe, "-v", "error", "-select_streams", "s:0",
         "-show_entries", "stream=codec_name", "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, timeout=30,
    )
    return process.stdout.strip().lower()


def _run_cut_job(token: str) -> None:
    job = CUT_JOBS.get(token)
    if not job:
        return
    try:
        job["stage"] = "cutting"
        job["progress"] = 0.0
        job["message"] = "正在切割…"
        ffmpeg, _ = ensure_media_tools()
        command = [
            ffmpeg, "-y", "-v", "error", "-progress", "pipe:1", "-nostats",
            "-ss", f"{job['start']:.3f}", "-i", str(job["input_path"]),
            "-t", f"{job['end'] - job['start']:.3f}",
            "-map", "0:v?", "-map", "0:a?", "-map", "0:s?", "-map", "0:t?",
            "-map_chapters", "-1",
        ]
        if job["mode"] == "precise":
            subtitle_codec = _first_subtitle_codec(job["input_path"])
            if subtitle_codec in ("hdmv_pgs_subtitle", "dvd_subtitle", "dvb_subtitle"):
                raise ValueError("精确模式暂不支持图形字幕（PGS/DVD），请改用快速模式")
            text_codec = "ass" if subtitle_codec in ("ass", "ssa") else "srt"
            command += [
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
            ]
            if subtitle_codec:
                command += ["-c:s", text_codec]
            command += ["-c:t", "copy"]
        else:
            command += ["-c", "copy", "-avoid_negative_ts", "make_zero"]
        command += ["-f", "matroska", str(job["output_path"])]
        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, bufsize=1,
        )
        duration = max(0.01, job["end"] - job["start"])
        if process.stdout is not None:
            for line in process.stdout:
                line = line.strip()
                if line.startswith("out_time_us="):
                    try:
                        seconds = float(line.split("=", 1)[1]) / 1_000_000
                    except ValueError:
                        seconds = 0.0
                    if seconds > 0:
                        job["progress"] = round(min(0.98, seconds / duration), 3)
                elif line.startswith("out_time="):
                    seconds = _mux_progress_seconds(line.split("=", 1)[1])
                    if seconds > 0:
                        job["progress"] = round(min(0.98, seconds / duration), 3)
                elif line.startswith("progress=") and line.endswith("end"):
                    job["progress"] = 0.99
        code = process.wait(timeout=30)
        if code != 0:
            raise ValueError("ffmpeg 切割失败")
        info = probe_video(job["output_path"])
        result = {
            "url": f"/api/cut/{token}/download",
            "filename": job["output_name"],
            "size": job["output_path"].stat().st_size,
            "duration": info.get("duration", 0),
            "video_codec": info.get("codec", ""),
            "audio_codec": info.get("audio_codec", ""),
        }
        (job["work_dir"] / "info.json").write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
        job["result"] = result
        job["progress"] = 1.0
        job["stage"] = "done"
        job["message"] = "切割完成"
    except Exception as exc:
        job["stage"] = "error"
        job["error"] = str(exc)
        job["message"] = f"切割失败：{exc}"
    finally:
        job["updated_at"] = time.time()


@app.post("/api/cut")
def cut_video():
    video = request.files.get("video")
    if video is None or not video.filename:
        return _error("没有收到视频文件")
    try:
        start = float(request.form.get("start") or 0)
        end = float(request.form.get("end") or 0)
    except ValueError:
        return _error("切割时间格式不正确")
    mode = (request.form.get("mode") or "copy").lower()
    if mode not in ("copy", "precise"):
        mode = "copy"
    token = uuid.uuid4().hex[:16]
    work_dir = CUT_DIR / token
    work_dir.mkdir(parents=True, exist_ok=True)
    suffix = Path(video.filename).suffix.lower() or ".mp4"
    input_path = work_dir / f"input{suffix}"
    output_path = work_dir / "output.mkv"
    try:
        video.save(str(input_path))
        info = probe_video(input_path)
        duration = float(info.get("duration") or 0)
        if start < 0 or end <= start or (duration and end > duration + 0.5):
            raise ValueError("切割范围不在视频时长内")
        output_name = f"{Path(_safe_filename(video.filename, 'output')).stem}_cut.mkv"
        with CUT_LOCK:
            CUT_JOBS[token] = {
                "token": token,
                "work_dir": work_dir,
                "input_path": input_path,
                "output_path": output_path,
                "output_name": output_name,
                "start": start,
                "end": min(end, duration) if duration else end,
                "mode": mode,
                "stage": "queued",
                "progress": 0.0,
                "message": "准备切割…",
                "error": "",
                "result": None,
                "updated_at": time.time(),
            }
        thread = threading.Thread(target=_run_cut_job, args=(token,), daemon=True)
        thread.start()
        cutoff = time.time() - 86400
        for stale in CUT_DIR.iterdir():
            if stale.is_dir() and stale.name != token:
                try:
                    if stale.stat().st_mtime < cutoff:
                        shutil.rmtree(stale, ignore_errors=True)
                except OSError:
                    pass
        return jsonify({
            "token": token,
            "status_url": f"/api/cut/{token}/status",
            "download_url": f"/api/cut/{token}/download",
        })
    except ValueError as exc:
        shutil.rmtree(work_dir, ignore_errors=True)
        return _error(f"切割失败：{exc}", 400)
    except Exception as exc:
        shutil.rmtree(work_dir, ignore_errors=True)
        return _error(f"切割失败：{exc}", 500)


@app.get("/api/cut/<token>/status")
def cut_status(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的切割任务", 404)
    job = CUT_JOBS.get(token)
    if job is None:
        output = CUT_DIR / token / "output.mkv"
        info_path = CUT_DIR / token / "info.json"
        if output.exists() and info_path.exists():
            try:
                result = json.loads(info_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                result = None
            return jsonify({"stage": "done", "progress": 1.0, "message": "切割完成", "result": result})
        return _error("切割任务不存在或已过期", 404)
    return jsonify({
        "stage": job["stage"],
        "progress": job["progress"],
        "message": job["message"],
        "error": job["error"],
        "result": job["result"],
    })


@app.get("/api/cut/<token>/download")
def cut_download(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的下载地址", 404)
    work_dir = CUT_DIR / token
    output = work_dir / "output.mkv"
    info_path = work_dir / "info.json"
    if not output.exists() or not info_path.exists():
        return _error("切割文件不存在或已过期", 404)
    try:
        info = json.loads(info_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        info = {}
    return send_file(
        output,
        as_attachment=True,
        download_name=info.get("filename") or "output_cut.mkv",
        mimetype="video/x-matroska",
    )


@app.get("/api/mux/<token>/download")
def mux_download(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的下载地址", 404)
    work_dir = MUX_DIR / token
    output = work_dir / "output.mkv"
    info_path = work_dir / "info.json"
    if not output.exists() or not info_path.exists():
        return _error("封装文件不存在或已过期", 404)
    try:
        info = json.loads(info_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        info = {}
    return send_file(
        output,
        as_attachment=True,
        download_name=info.get("filename") or "output.mkv",
        mimetype="video/x-matroska",
    )


@app.post("/api/sync/align")
def sync_align():
    upload = request.files.get("video")
    source_id = request.form.get("source_job")
    if upload is None or not upload.filename:
        return _error("没有收到纯净视频文件")
    if not source_id:
        return _error("请选择原硬字幕视频")
    source = manager.get(source_id)
    if not source.video_path.exists():
        return _error("原视频文件不存在", 404)
    suffix = Path(upload.filename).suffix.lower() or ".mp4"
    temp_path = Path(tempfile.gettempdir()) / f"hardsub-align-{uuid.uuid4().hex}{suffix}"
    try:
        upload.save(str(temp_path))
        result = align_audio(source.video_path, temp_path)
        result["source_job"] = source.id
        result["source_name"] = source.name
        return jsonify(result)
    except ValueError as exc:
        return _error(f"自动同步失败：{exc}", 400)
    except Exception as exc:
        return _error(f"自动同步失败：{exc}", 500)
    finally:
        try:
            temp_path.unlink(missing_ok=True)
        except OSError:
            pass


@app.get("/api/jobs/<job_id>")
def get_job(job_id: str):
    job = manager.get(job_id)
    return jsonify(job.to_dict(include_cues=True))


@app.post("/api/jobs/<job_id>/start")
def start_job(job_id: str):
    data = request.get_json(silent=True) or {}
    settings = data.get("settings") if isinstance(data, dict) else None
    if settings is None and isinstance(data, dict):
        settings = data
    job = manager.start(job_id, settings or {})
    return jsonify(job.to_dict(include_cues=False))


@app.post("/api/jobs/<job_id>/cancel")
def cancel_job(job_id: str):
    job = manager.cancel(job_id)
    return jsonify(job.to_dict(include_cues=False))


@app.post("/api/jobs/<job_id>/detect-region")
def detect_region_route(job_id: str):
    data = request.get_json(silent=True) or {}
    try:
        result = manager.detect_region(
            job_id, data.get("languages"),
            data.get("extraction_start"), data.get("extraction_end"),
        )
    except Exception as exc:
        return _error(f"自动检测字幕区域失败：{exc}", 400)
    return jsonify(result)


@app.patch("/api/jobs/<job_id>/cues")
def patch_cues(job_id: str):
    data = request.get_json(silent=True) or {}
    job = manager.update_cues(job_id, data.get("cues"))
    return jsonify({"ok": True, "cue_count": len(job.cues), "stats": job.stats})


@app.get("/api/jobs/<job_id>/video")
def job_video(job_id: str):
    job = manager.get(job_id)
    if not job.video_path.exists():
        return _error("视频文件不存在", 404)
    response = send_file(job.video_path, conditional=True, as_attachment=False)
    response.headers["Accept-Ranges"] = "bytes"
    return response


@app.get("/api/jobs/<job_id>/poster")
def job_poster(job_id: str):
    job = manager.get(job_id)
    path = job.dir / "poster.jpg"
    if not path.exists():
        return _error("没有封面", 404)
    response = send_file(path, conditional=True, mimetype="image/jpeg")
    response.headers["Cache-Control"] = "public, max-age=3600"
    return response


@app.get("/api/jobs/<job_id>/download/<fmt>")
def download(job_id: str, fmt: str):
    job = manager.get(job_id)
    content, mimetype, filename = subtitle_response(job, fmt)
    body = ("\ufeff" + content).encode("utf-8")
    response = Response(body, mimetype=mimetype)
    response.headers["Content-Disposition"] = f"attachment; filename*=UTF-8''{quote(filename)}"
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/api/jobs/<job_id>/events")
def job_events(job_id: str):
    job = manager.get(job_id)
    subscriber = job.subscribe()

    def generate():
        try:
            snapshot = job.to_dict(include_cues=True)
            yield _sse({"type": "snapshot", "job": snapshot})
            while True:
                try:
                    event = subscriber.get(timeout=15)
                except queue.Empty:
                    yield ": ping\n\n"
                    continue
                yield _sse(event)
                if event.get("type") == "finished":
                    break
        finally:
            job.unsubscribe(subscriber)

    response = Response(stream_with_context(generate()), mimetype="text/event-stream")
    response.headers["Cache-Control"] = "no-cache, no-transform"
    response.headers["X-Accel-Buffering"] = "no"
    response.headers["Connection"] = "keep-alive"
    return response


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


@app.delete("/api/jobs/<job_id>")
def delete_job(job_id: str):
    manager.delete(job_id)
    return jsonify({"ok": True})


def _free_port(host: str, preferred: int) -> int:
    for port in range(preferred, preferred + 30):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind((host, port))
                return port
            except OSError:
                continue
    raise SystemExit(f"端口 {preferred}–{preferred + 29} 都被占用")


def main():
    parser = argparse.ArgumentParser(description="HardSub Studio — hard-coded subtitle extractor")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--open", action="store_true", help="启动后打开浏览器")
    args = parser.parse_args()

    try:
        ensure_media_tools()
    except MediaError as exc:
        print(f"⚠️  {exc}")
    if not OCR_BINARY.exists():
        print("⚠️  没有找到 Vision OCR 组件，请先运行 ./setup.sh")

    port = _free_port(args.host, args.port)
    url = f"http://{args.host}:{port}"
    print(f"\n  HardSub Studio  {url}\n")
    if args.open:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    app.run(host=args.host, port=port, debug=False, threaded=True, use_reloader=False)


if __name__ == "__main__":
    main()
