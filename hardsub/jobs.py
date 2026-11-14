from __future__ import annotations

import json
import queue
import shutil
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .media import MediaError, make_poster, probe_video
from .paths import JOBS_DIR
from .pipeline import CancelledError, detect_region, normalize_settings, run_extraction
from .subtitles import build_ass, build_srt, safe_stem, write_text_file


class JobError(RuntimeError):
    pass


class BusyError(JobError):
    pass


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _same_roi(a: dict, b: dict) -> bool:
    return all(abs(float(a.get(key, 0)) - float(b.get(key, 0))) < 0.006 for key in ("x", "y", "w", "h"))


def _remember_roi(settings: dict) -> None:
    history = list(settings.get("roi_history") or [])
    current = settings.get("roi") or {}
    existing = None
    for item in history:
        if isinstance(item, dict) and _same_roi(item.get("roi") or {}, current):
            existing = item
            break
    if existing:
        try:
            history.remove(existing)
        except ValueError:
            pass
        uses = int(existing.get("uses") or 1) + 1
    else:
        uses = 1
    history.insert(0, {
        "roi": dict(current),
        "used_at": _now(),
        "uses": uses,
        "source": "extract",
    })
    settings["roi_history"] = history[:20]


class Job:
    def __init__(
        self,
        job_id: str,
        directory: Path,
        name: str,
        video_path: Path,
        probe: dict,
        *,
        created_at: str | None = None,
        status: str = "ready",
        settings: dict | None = None,
        cues: list[dict] | None = None,
        stats: dict | None = None,
        error: str = "",
        poster: bool = False,
    ):
        self.id = job_id
        self.dir = directory
        self.name = name
        self.video_path = video_path
        self.probe = probe
        self.created_at = created_at or _now()
        self.status = status
        self.settings = normalize_settings(settings)
        self.cues = cues or []
        self.partial_cues: list[dict] = []
        self.stats = stats or {}
        self.error = error
        self.poster = poster
        self.progress = 1.0 if status == "done" else 0.0
        self.stage = "done" if status == "done" else "ready"
        self.message = "已完成" if status == "done" else "等待开始"
        self.logs: list[dict] = []
        self.cancel_event = threading.Event()
        self.lock = threading.RLock()
        self.subscribers: list[queue.Queue] = []

    # ---- serialization -------------------------------------------------
    def to_dict(self, include_cues: bool = False) -> dict:
        with self.lock:
            data = {
                "id": self.id,
                "name": self.name,
                "created_at": self.created_at,
                "status": self.status,
                "progress": round(self.progress, 4),
                "stage": self.stage,
                "message": self.message,
                "probe": self.probe,
                "settings": self.settings,
                "stats": self.stats,
                "error": self.error,
                "poster": self.poster,
                "size": self.probe.get("size", 0),
                "has_cues": bool(self.cues),
                "cue_count": len(self.cues),
                "partial_count": len(self.partial_cues),
                "logs": self.logs[-80:],
            }
            if include_cues:
                data["cues"] = self.cues
                data["partial_cues"] = list(self.partial_cues)
            return data

    def _payload(self, include_cues: bool = False) -> dict:
        with self.lock:
            data = {
                "id": self.id,
                "name": self.name,
                "status": self.status,
                "progress": round(self.progress, 4),
                "stage": self.stage,
                "message": self.message,
                "stats": self.stats,
                "error": self.error,
                "cue_count": len(self.cues),
            }
            if include_cues:
                data["cues"] = self.cues
            return data

    def save(self):
        with self.lock:
            data = {
                "id": self.id,
                "name": self.name,
                "created_at": self.created_at,
                "status": self.status,
                "settings": self.settings,
                "stats": self.stats,
                "cues": self.cues,
                "error": self.error,
                "probe": self.probe,
                "poster": self.poster,
            }
        target = self.dir / "job.json"
        temp = self.dir / "job.json.tmp"
        temp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        temp.replace(target)

    # ---- progress / events ---------------------------------------------
    def publish(self, event: dict):
        with self.lock:
            subscribers = list(self.subscribers)
        for subscriber in subscribers:
            try:
                subscriber.put_nowait(event)
            except queue.Full:
                try:
                    subscriber.get_nowait()
                except queue.Empty:
                    pass
                try:
                    subscriber.put_nowait(event)
                except queue.Full:
                    pass

    def log(self, message: str, level: str = "info"):
        entry = {
            "time": time.strftime("%H:%M:%S"),
            "level": level,
            "message": message,
        }
        with self.lock:
            self.logs.append(entry)
            if len(self.logs) > 300:
                del self.logs[:100]
        self.publish({"type": "log", "log": entry})

    def update_partial(self, cues: list[dict]):
        with self.lock:
            if self.status != "processing":
                return
            self.partial_cues = list(cues)
        self.publish({"type": "partial", "cues": self.partial_cues, "count": len(self.partial_cues)})

    def update_progress(self, value: float, stage: str, message: str, stats: dict | None = None):
        with self.lock:
            self.progress = max(self.progress, min(1.0, max(0.0, value)))
            self.stage = stage
            self.message = message
            if stats:
                self.stats.update(stats)
        self.publish({"type": "state", **self._payload()})

    def subscribe(self) -> queue.Queue:
        subscriber: queue.Queue = queue.Queue(maxsize=80)
        with self.lock:
            self.subscribers.append(subscriber)
        return subscriber

    def unsubscribe(self, subscriber: queue.Queue):
        with self.lock:
            try:
                self.subscribers.remove(subscriber)
            except ValueError:
                pass

    # ---- subtitle output ------------------------------------------------
    def _meta(self) -> dict:
        return {
            "display_width": self.probe.get("display_width") or self.probe.get("width"),
            "display_height": self.probe.get("display_height") or self.probe.get("height"),
            "roi": self.settings.get("roi", {}),
            "font_name": self.settings.get("font_name") or "Kaiti SC",
            "font_size": self.settings.get("font_size") or 70,
            "border_width": self.settings.get("border_width", 2.0),
            "line_height_px": self.stats.get("line_height_px") or 0,
            "title": safe_stem(self.name),
        }

    def srt(self) -> str:
        return build_srt(self.cues)

    def ass(self, style: dict | None = None) -> str:
        meta = self._meta()
        if style:
            meta.update(style)
        return build_ass(self.cues, meta)

    def write_outputs(self):
        write_text_file(self.dir / "result.srt", self.srt())
        write_text_file(self.dir / "result.ass", self.ass())


MAX_JOBS = 8
MAX_JOB_BYTES = 20 * 1024 * 1024 * 1024


class JobManager:
    def __init__(self, jobs_dir: Path = JOBS_DIR):
        self.jobs_dir = jobs_dir
        self.jobs_dir.mkdir(parents=True, exist_ok=True)
        self.jobs: dict[str, Job] = {}
        self.lock = threading.RLock()
        self.active_id: str | None = None
        self._load_existing()

    def _load_existing(self):
        for path in sorted(self.jobs_dir.glob("*/job.json"), key=lambda p: p.stat().st_mtime, reverse=True):
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
                job_id = data.get("id") or path.parent.name
                video = next((p for p in path.parent.iterdir() if p.stem == "input"), None)
                if not video:
                    continue
                status = data.get("status", "ready")
                error = data.get("error", "")
                if status == "processing":
                    status = "cancelled"
                    error = "服务重启，任务已中断"
                job = Job(
                    job_id, path.parent, data.get("name") or video.name, video,
                    data.get("probe") or {},
                    created_at=data.get("created_at"),
                    status=status,
                    settings=data.get("settings"),
                    cues=data.get("cues") or [],
                    stats=data.get("stats") or {},
                    error=error,
                    poster=bool(data.get("poster")),
                )
                if status == "done" and not data.get("stats"):
                    job.stats = {"cues": len(job.cues)}
                if status == "cancelled":
                    job.message = error or "已取消"
                    job.stage = "cancelled"
                self.jobs[job.id] = job
            except Exception:
                continue

    def prune(self) -> None:
        """Limit saved source videos so data/jobs cannot grow forever."""
        with self.lock:
            jobs = sorted(
                self.jobs.values(),
                key=lambda job: job.dir.stat().st_mtime if job.dir.exists() else 0,
            )
        total = 0
        sizes = {}
        for job in jobs:
            size = 0
            try:
                for path in job.dir.rglob("*"):
                    if path.is_file():
                        size += path.stat().st_size
            except OSError:
                pass
            sizes[job.id] = size
            total += size
        remove = []
        remaining = len(jobs)
        for job in jobs:
            if remaining <= MAX_JOBS and total <= MAX_JOB_BYTES:
                break
            if job.status == "processing":
                continue
            remove.append(job.id)
            remaining -= 1
            total -= sizes.get(job.id, 0)
        for job_id in remove:
            try:
                self.delete(job_id)
            except Exception:
                pass

    # ---- creation -------------------------------------------------------
    def create(self, file_storage, original_name: str | None) -> Job:
        display_name = original_name or getattr(file_storage, "filename", None) or "video"
        suffix = Path(display_name).suffix.lower()
        if suffix not in ("", ".mp4", ".mkv", ".mov", ".avi", ".webm", ".m4v", ".ts", ".flv", ".wmv", ".mpg", ".mpeg"):
            suffix = ".mp4"
        job_id = uuid.uuid4().hex[:12]
        directory = self.jobs_dir / job_id
        directory.mkdir(parents=True, exist_ok=False)
        video_path = directory / f"input{suffix}"
        try:
            file_storage.save(str(video_path))
            if video_path.stat().st_size == 0:
                raise JobError("上传的文件是空的")
            probe = probe_video(video_path)
            poster = False
            try:
                make_poster(video_path, probe["duration"], directory / "poster.jpg")
                poster = True
            except MediaError:
                pass
            job = Job(job_id, directory, display_name, video_path, probe, poster=poster)
            job.save()
            with self.lock:
                self.jobs[job.id] = job
            return job
        except Exception:
            shutil.rmtree(directory, ignore_errors=True)
            raise

    # ---- lookup ---------------------------------------------------------
    def get(self, job_id: str) -> Job:
        with self.lock:
            job = self.jobs.get(job_id)
        if not job:
            raise JobError("找不到这个任务")
        return job

    def list(self, limit: int = 12) -> list[dict]:
        with self.lock:
            jobs = sorted(self.jobs.values(), key=lambda j: j.created_at, reverse=True)
        return [job.to_dict(include_cues=False) for job in jobs[:limit]]

    def delete(self, job_id: str):
        job = self.get(job_id)
        if job.status == "processing":
            raise BusyError("任务正在运行，请先取消")
        with self.lock:
            self.jobs.pop(job_id, None)
        target = job.dir.resolve()
        base = self.jobs_dir.resolve()
        if base in target.parents:
            shutil.rmtree(target, ignore_errors=True)

    # ---- run ------------------------------------------------------------
    def start(self, job_id: str, raw_settings: dict) -> Job:
        job = self.get(job_id)
        if job.status == "processing":
            raise BusyError("这个任务正在运行中")
        with self.lock:
            incoming = dict(raw_settings or {})
            if "roi_history" not in incoming:
                incoming["roi_history"] = list(job.settings.get("roi_history") or [])
            job.settings = normalize_settings(incoming)
            _remember_roi(job.settings)
            job.cues = []
            job.stats = {}
            job.error = ""
            job.progress = 0.0
            job.stage = "starting"
            job.message = "正在启动识别引擎…"
            job.status = "processing"
            job.cancel_event = threading.Event()
        job.log("开始识别任务", "info")
        job.save()
        job.publish({"type": "state", **job._payload()})
        thread = threading.Thread(target=self._run, args=(job,), daemon=True)
        thread.start()
        return job

    def save_settings(self, job_id: str, raw_settings: dict) -> Job:
        job = self.get(job_id)
        if job.status == "processing":
            raise BusyError("识别过程中不能修改设置")
        with self.lock:
            job.settings = normalize_settings(raw_settings)
            _remember_roi(job.settings)
        job.save()
        return job

    def cancel(self, job_id: str) -> Job:
        job = self.get(job_id)
        if job.status != "processing":
            return job
        job.cancel_event.set()
        job.message = "正在取消…"
        job.publish({"type": "state", **job._payload()})
        return job

    def _run(self, job: Job):
        work_dir = job.dir / "work"
        try:
            job.log("加载视频信息并准备 OCR 引擎…", "info")
            result = run_extraction(
                str(job.video_path), job.probe, job.settings,
                work_dir, job.update_progress, job.log,
                job.cancel_event, ocr_workers=4, partial=job.update_partial,
            )
            with job.lock:
                job.cues = result["cues"]
                job.partial_cues = []
                job.stats = result["stats"]
                job.settings = result["settings"]
                job.status = "done"
                job.progress = 1.0
                job.stage = "done"
                job.message = f"识别完成，共 {len(job.cues)} 条字幕"
                job.error = ""
            job.write_outputs()
            job.save()
            job.log(job.message, "success")
            job.publish({"type": "finished", **_payload_with_cues(job)})
        except CancelledError:
            with job.lock:
                job.status = "cancelled"
                job.stage = "cancelled"
                job.message = "任务已取消"
                job.error = ""
            job.save()
            job.log("任务已取消", "warn")
            job.publish({"type": "finished", **_payload_with_cues(job)})
        except Exception as exc:
            with job.lock:
                job.status = "error"
                job.stage = "error"
                job.error = str(exc)
                job.message = f"识别失败：{exc}"
            job.save()
            job.log(f"识别失败：{exc}", "error")
            job.publish({"type": "finished", **_payload_with_cues(job)})
        finally:
            shutil.rmtree(work_dir, ignore_errors=True)

    def detect_region(self, job_id: str, languages=None, start_time=None, end_time=None) -> dict:
        job = self.get(job_id)
        if job.status == "processing":
            raise BusyError("请等待当前任务结束")
        return detect_region(
            str(job.video_path), job.probe, job.dir / "work",
            languages=languages,
            start_time=start_time,
            end_time=end_time,
        )

    def update_cues(self, job_id: str, cues: Any) -> Job:
        job = self.get(job_id)
        if job.status == "processing":
            raise BusyError("识别过程中暂时不能编辑字幕")
        if not isinstance(cues, list):
            raise JobError("字幕数据格式不正确")
        if len(cues) > 20000:
            raise JobError("字幕条数过多")
        cleaned = []
        duration = float(job.probe.get("duration") or 0)
        for index, cue in enumerate(cues, 1):
            if not isinstance(cue, dict):
                continue
            try:
                start = float(cue.get("start", 0))
                end = float(cue.get("end", 0))
                confidence = float(cue.get("confidence", 0) or 0)
            except (TypeError, ValueError):
                continue
            text = str(cue.get("text") or "").replace("\r\n", "\n").replace("\r", "\n")[:1000]
            start = max(0.0, min(start, max(0.0, duration - 0.01)))
            end = max(start + 0.02, min(end, duration if duration else end))
            cleaned.append({
                "id": len(cleaned) + 1,
                "start": round(start, 3),
                "end": round(end, 3),
                "text": text,
                "confidence": round(max(0.0, min(1.0, confidence)), 3),
            })
        with job.lock:
            job.cues = cleaned
            job.stats["cues"] = len(cleaned)
            job.stats["chars"] = sum(len(c["text"]) for c in cleaned)
        job.write_outputs()
        job.save()
        job.publish({"type": "edited", "cue_count": len(cleaned), "stats": job.stats})
        return job


def _payload_with_cues(job: Job) -> dict:
    payload = job._payload()
    with job.lock:
        payload["cues"] = job.cues
    return payload


def subtitle_response(job: Job, fmt: str, style: dict | None = None) -> tuple[str, str, str]:
    fmt = fmt.lower()
    if fmt == "srt":
        return job.srt(), "application/x-subrip; charset=utf-8", f"{safe_stem(job.name)}.srt"
    if fmt == "ass":
        return job.ass(style), "text/x-ssa; charset=utf-8", f"{safe_stem(job.name)}.ass"
    raise JobError("只支持 srt 或 ass 格式")


def job_media_path(job: Job) -> Path:
    return job.video_path
