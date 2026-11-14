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
from hardsub.translator import TranslationError, translate_subtitle_file
from hardsub.subtitles import shift_subtitle_file

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
# Cut jobs are temporary: the finished file is auto-saved to ~/Downloads.
# Remove leftovers from a previous run so the work directory never grows.
for _stale in CUT_DIR.iterdir():
    try:
        if _stale.is_dir():
            shutil.rmtree(_stale, ignore_errors=True)
        else:
            _stale.unlink(missing_ok=True)
    except OSError:
        pass
CUT_JOBS: dict[str, dict] = {}
CUT_LOCK = threading.Lock()
TRANSLATE_DIR = manager.jobs_dir.parent / "translations"
TRANSLATE_DIR.mkdir(parents=True, exist_ok=True)
TRANSLATE_JOBS: dict[str, dict] = {}
TRANSLATE_LOCK = threading.Lock()


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
        "version": "1.15.0",
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


@app.post("/api/translate")
def start_translation():
    upload = request.files.get("subtitle")
    if upload is None or not upload.filename:
        return _error("没有收到字幕文件")
    suffix = Path(upload.filename).suffix.lower()
    if suffix not in (".srt", ".ass", ".ssa"):
        return _error("只支持 SRT、ASS 或 SSA 字幕文件")
    source = (request.form.get("source") or "auto").lower()
    target = (request.form.get("target") or "zh-Hant").lower()
    if source not in ("auto", "ja", "en"):
        return _error("源语言只支持自动、日语或英语")
    if target not in ("zh-hant", "zh-hans"):
        return _error("目标语言只支持繁体中文或简体中文")
    target = "zh-Hant" if target == "zh-hant" else "zh-Hans"
    bilingual = (request.form.get("bilingual") or "").lower() in ("1", "true", "on", "yes")
    token = uuid.uuid4().hex[:16]
    work_dir = TRANSLATE_DIR / token
    work_dir.mkdir(parents=True, exist_ok=True)
    input_path = work_dir / f"source{suffix}"
    upload.save(str(input_path))
    if input_path.stat().st_size > 8 * 1024 * 1024:
        shutil.rmtree(work_dir, ignore_errors=True)
        return _error("字幕文件不能超过 8 MB")
    output_name = f"{Path(upload.filename).stem}.{'zh-Hant' if target == 'zh-hant' else 'zh-Hans'}{suffix}"
    with TRANSLATE_LOCK:
        TRANSLATE_JOBS[token] = {
            "token": token,
            "status": "queued",
            "progress": 0.0,
            "message": "准备翻译…",
            "source": source,
            "target": target,
            "bilingual": bilingual,
            "input_path": input_path,
            "output_path": work_dir / f"translated{suffix}",
            "download_name": _safe_filename(output_name, "translated.srt"),
            "preview": [],
            "entries": 0,
            "error": "",
            "created": time.time(),
        }
    thread = threading.Thread(target=_run_translation_job, args=(token,), daemon=True)
    thread.start()
    return jsonify({"token": token, "status": "queued"}), 202


def _run_translation_job(token: str) -> None:
    job = TRANSLATE_JOBS.get(token)
    if not job:
        return
    def progress(done: int, total: int) -> None:
        with TRANSLATE_LOCK:
            current = TRANSLATE_JOBS.get(token)
            if current:
                current["progress"] = min(0.98, done / max(1, total))
                current["message"] = f"正在翻译 {done}/{total} 行…"
    try:
        with TRANSLATE_LOCK:
            job["status"] = "running"
            job["message"] = "正在解析字幕…"
        result = translate_subtitle_file(
            job["input_path"], job["output_path"], job["source"], job["target"],
            job["bilingual"], progress=progress,
        )
        with TRANSLATE_LOCK:
            job["status"] = "done"
            job["progress"] = 1.0
            job["message"] = f"翻译完成，共 {result['entries']} 条字幕"
            job["preview"] = result["preview"]
            job["entries"] = result["entries"]
    except TranslationError as exc:
        with TRANSLATE_LOCK:
            job["status"] = "error"
            job["error"] = str(exc)
            job["message"] = str(exc)
    except Exception as exc:
        with TRANSLATE_LOCK:
            job["status"] = "error"
            job["error"] = f"翻译失败：{exc}"
            job["message"] = job["error"]


@app.get("/api/translate/<token>")
def translation_status(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的翻译任务", 404)
    with TRANSLATE_LOCK:
        job = TRANSLATE_JOBS.get(token)
        if not job:
            return _error("翻译任务不存在或已过期", 404)
        return jsonify({
            "token": token,
            "status": job["status"],
            "progress": round(job["progress"], 3),
            "message": job["message"],
            "preview": job["preview"],
            "entries": job["entries"],
            "error": job["error"],
            "download": f"/api/translate/{token}/download" if job["status"] == "done" else "",
        })


@app.get("/api/translate/tasks")
def translate_tasks():
    with TRANSLATE_LOCK:
        tasks = []
        for job in TRANSLATE_JOBS.values():
            tasks.append({
                "token": job["token"],
                "status": job["status"],
                "progress": round(float(job.get("progress") or 0), 3),
                "message": job.get("message") or "",
                "filename": job.get("download_name") or "",
                "saved_path": "",
                "size": 0,
                "error": job.get("error") or "",
                "created": job.get("created") or 0,
            })
    tasks.sort(key=lambda item: item["created"], reverse=True)
    return jsonify({"tasks": tasks[:40]})


@app.delete("/api/translate/tasks/<token>")
def delete_translate_task(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的任务", 404)
    with TRANSLATE_LOCK:
        job = TRANSLATE_JOBS.pop(token, None)
    if job:
        try:
            shutil.rmtree(job["output_path"].parent, ignore_errors=True)
        except OSError:
            pass
    return jsonify({"ok": True})


@app.get("/api/translate/<token>/download")
def download_translation(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的翻译任务", 404)
    with TRANSLATE_LOCK:
        job = TRANSLATE_JOBS.get(token)
        if not job or job["status"] != "done":
            return _error("翻译结果尚未准备好", 404)
        output = job["output_path"]
        name = job["download_name"]
    if not output.exists():
        return _error("翻译结果不存在", 404)
    return send_file(output, as_attachment=True, download_name=name)


def _safe_filename(value: str, fallback: str = "output") -> str:
    name = Path(value or "").name
    name = re.sub(r"[\\/:*?\"<>|\x00-\x1f]", "_", name).strip(" .")
    return name or fallback


def _publish_output(job: dict, filename: str, result: dict) -> None:
    """Move a finished mux/cut file to ~/Downloads automatically."""
    source = Path(job["output_path"])
    if not source.exists():
        return
    downloads = Path.home() / "Downloads"
    try:
        downloads.mkdir(parents=True, exist_ok=True)
    except OSError:
        return
    safe_name = _safe_filename(filename, "output.mkv")
    target = downloads / safe_name
    stem, suffix = target.stem, target.suffix
    counter = 2
    while target.exists():
        target = downloads / f"{stem} ({counter}){suffix}"
        counter += 1
    try:
        shutil.move(str(source), str(target))
        job["output_path"] = target
        job["saved_path"] = str(target)
        result["saved_path"] = str(target)
    except OSError:
        # Keep the file in the work dir; the download endpoint still works.
        pass


def _cleanup_mux_workspace() -> None:
    """Keep finished mux outputs in Downloads and drop old work dirs.

    Mux work dirs contain the uploaded video copy and can be tens of GB. They
    are no longer needed once the output has been saved.
    """
    downloads = Path.home() / "Downloads"
    try:
        downloads.mkdir(parents=True, exist_ok=True)
    except OSError:
        return
    for directory in MUX_DIR.iterdir():
        if not directory.is_dir():
            try:
                directory.unlink()
            except OSError:
                pass
            continue
        output = directory / "output.mkv"
        info_path = directory / "info.json"
        if output.exists():
            saved_path = None
            filename = f"{directory.name}.mkv"
            if info_path.exists():
                try:
                    info = json.loads(info_path.read_text(encoding="utf-8"))
                    saved_path = info.get("saved_path")
                    filename = info.get("filename") or filename
                except (OSError, json.JSONDecodeError):
                    pass
            target = Path(saved_path) if saved_path else None
            if target is None or not target.exists():
                target = downloads / _safe_filename(filename, "output.mkv")
                stem, suffix = target.stem, target.suffix
                counter = 2
                while target.exists():
                    target = downloads / f"{stem} ({counter}){suffix}"
                    counter += 1
                try:
                    shutil.move(str(output), str(target))
                except OSError:
                    continue
        shutil.rmtree(directory, ignore_errors=True)


_cleanup_mux_workspace()


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
        _publish_output(job, job["output_name"], result)
        (job["work_dir"] / "info.json").write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
        job["result"] = result
        job["progress"] = 1.0
        job["stage"] = "done"
        job["message"] = "封装完成"
        if job.get("saved_path"):
            shutil.rmtree(job["work_dir"], ignore_errors=True)
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
        try:
            offset = float(request.form.get("offset") or 0)
        except ValueError:
            offset = 0.0
        offset = max(-3600.0, min(3600.0, offset))
        if abs(offset) > 0.001:
            shifted_path = work_dir / f"subtitle.shifted{subtitle_suffix}"
            shift_subtitle_file(subtitle_path, shifted_path, offset)
            subtitle_path = shifted_path
        info = probe_video(video_path)
        language = (request.form.get("language") or "chi").lower()
        language = language if language in {"chi", "eng", "jpn", "kor", "und"} else "und"
        language_titles = {"chi": "中文", "eng": "English", "jpn": "日本語", "kor": "한국어", "und": "未指定"}
        title = (request.form.get("title") or language_titles[language]).strip()[:100]
        if not title:
            title = language_titles[language]
        is_default = (request.form.get("default") or "1").lower() not in ("0", "false", "no")
        requested_name = _safe_filename(request.form.get("output_name") or "", "")
        if not requested_name:
            requested_name = f"{Path(_safe_filename(video.filename, 'output')).stem}.mkv"
        if not requested_name.lower().endswith(".mkv"):
            requested_name += ".mkv"
        output_name = requested_name
        with MUX_LOCK:
            for existing in MUX_JOBS.values():
                if (existing.get("output_name") == output_name
                        and existing.get("stage") in ("queued", "muxing", "cutting")):
                    raise ValueError("同名封装任务正在运行，请等待完成或删除重复任务")
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
                "offset": offset,
                "duration": info.get("duration", 0),
                "stage": "queued",
                "progress": 0.0,
                "message": "准备封装…",
                "error": "",
                "result": None,
                "created": time.time(),
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
        result = None
        if info_path.exists():
            try:
                result = json.loads(info_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                result = None
        saved = Path(result["saved_path"]) if result and result.get("saved_path") else None
        if (output.exists() or (saved and saved.exists())) and result is not None:
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
        _publish_output(job, job["output_name"], result)
        (job["work_dir"] / "info.json").write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
        job["result"] = result
        job["progress"] = 1.0
        job["stage"] = "done"
        job["message"] = "切割完成"
        if job.get("saved_path"):
            shutil.rmtree(job["work_dir"], ignore_errors=True)
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
                "created": time.time(),
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
        result = None
        if info_path.exists():
            try:
                result = json.loads(info_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                result = None
        saved = Path(result["saved_path"]) if result and result.get("saved_path") else None
        if (output.exists() or (saved and saved.exists())) and result is not None:
            return jsonify({"stage": "done", "progress": 1.0, "message": "切割完成", "result": result})
        return _error("切割任务不存在或已过期", 404)
    return jsonify({
        "stage": job["stage"],
        "progress": job["progress"],
        "message": job["message"],
        "error": job["error"],
        "result": job["result"],
    })


@app.get("/api/cut/tasks")
def cut_tasks():
    with CUT_LOCK:
        tasks = []
        for job in CUT_JOBS.values():
            result = job.get("result") or {}
            tasks.append({
                "token": job["token"],
                "status": job["stage"],
                "progress": round(float(job.get("progress") or 0), 3),
                "message": job.get("message") or "",
                "filename": result.get("filename") or job.get("output_name") or "",
                "saved_path": result.get("saved_path") or job.get("saved_path") or "",
                "size": result.get("size") or 0,
                "error": job.get("error") or "",
                "created": job.get("created") or 0,
            })
    tasks.sort(key=lambda item: item["created"], reverse=True)
    return jsonify({"tasks": tasks[:40]})


@app.delete("/api/cut/tasks/<token>")
def delete_cut_task(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的任务", 404)
    with CUT_LOCK:
        job = CUT_JOBS.pop(token, None)
    if job:
        shutil.rmtree(job.get("work_dir") or CUT_DIR / token, ignore_errors=True)
    return jsonify({"ok": True})


@app.get("/api/cut/<token>/download")
def cut_download(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的下载地址", 404)
    work_dir = CUT_DIR / token
    info_path = work_dir / "info.json"
    job = CUT_JOBS.get(token)
    output = Path(job["output_path"]) if job and job.get("output_path") else work_dir / "output.mkv"
    try:
        info = json.loads(info_path.read_text(encoding="utf-8")) if info_path.exists() else {}
    except (OSError, json.JSONDecodeError):
        info = {}
    if not output.exists() and info.get("saved_path"):
        output = Path(info["saved_path"])
    if not output.exists():
        return _error("切割文件不存在或已过期", 404)
    return send_file(
        output,
        as_attachment=True,
        download_name=info.get("filename") or "output_cut.mkv",
        mimetype="video/x-matroska",
    )


@app.get("/api/mux/tasks")
def mux_tasks():
    with MUX_LOCK:
        tasks = []
        for job in MUX_JOBS.values():
            result = job.get("result") or {}
            tasks.append({
                "token": job["token"],
                "status": job["stage"],
                "progress": round(float(job.get("progress") or 0), 3),
                "message": job.get("message") or "",
                "filename": result.get("filename") or job.get("output_name") or "",
                "saved_path": result.get("saved_path") or job.get("saved_path") or "",
                "size": result.get("size") or 0,
                "error": job.get("error") or "",
                "created": job.get("created") or 0,
            })
    tasks.sort(key=lambda item: item["created"], reverse=True)
    return jsonify({"tasks": tasks[:40]})


@app.delete("/api/mux/tasks/<token>")
def delete_mux_task(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的任务", 404)
    with MUX_LOCK:
        job = MUX_JOBS.pop(token, None)
    if job:
        shutil.rmtree(job.get("work_dir") or MUX_DIR / token, ignore_errors=True)
    return jsonify({"ok": True})


@app.get("/api/mux/<token>/download")
def mux_download(token: str):
    if not token or any(char not in "0123456789abcdef" for char in token):
        return _error("无效的下载地址", 404)
    work_dir = MUX_DIR / token
    info_path = work_dir / "info.json"
    job = MUX_JOBS.get(token)
    output = Path(job["output_path"]) if job and job.get("output_path") else work_dir / "output.mkv"
    try:
        info = json.loads(info_path.read_text(encoding="utf-8")) if info_path.exists() else {}
    except (OSError, json.JSONDecodeError):
        info = {}
    if not output.exists() and info.get("saved_path"):
        output = Path(info["saved_path"])
    if not output.exists():
        return _error("封装文件不存在或已过期", 404)
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


@app.patch("/api/jobs/<job_id>/settings")
def save_job_settings(job_id: str):
    data = request.get_json(silent=True) or {}
    settings = data.get("settings") if isinstance(data, dict) else None
    if settings is None and isinstance(data, dict):
        settings = data
    job = manager.save_settings(job_id, settings or {})
    return jsonify(job.to_dict(include_cues=False))


@app.post("/api/jobs/batch-start")
def batch_start_jobs():
    data = request.get_json(silent=True) or {}
    ids = data.get("ids") if isinstance(data, dict) else None
    if not isinstance(ids, list) or not ids:
        return _error("请选择要执行的任务")
    started, skipped = [], []
    for job_id in ids:
        try:
            job = manager.get(str(job_id))
            if job.status == "processing":
                skipped.append({"id": job.id, "reason": "正在运行"})
                continue
            manager.start(job.id, job.settings)
            started.append(job.id)
        except Exception as exc:
            skipped.append({"id": str(job_id), "reason": str(exc)})
    return jsonify({"started": started, "skipped": skipped})


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
    style = {}
    if fmt.lower() == "ass":
        font_name = (request.args.get("font_name") or "").strip()
        if font_name:
            style["font_name"] = font_name[:80]
        try:
            if request.args.get("font_size"):
                style["font_size"] = max(16, min(200, int(float(request.args["font_size"]))))
            if request.args.get("border_width"):
                style["border_width"] = round(max(0.0, min(12.0, float(request.args["border_width"]))), 1)
        except ValueError:
            pass
    content, mimetype, filename = subtitle_response(job, fmt, style)
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
