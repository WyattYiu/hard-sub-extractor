from __future__ import annotations

import json
import os
import queue
import select
import subprocess
import threading
import time
from collections import deque
from pathlib import Path

from .paths import OCR_BINARY


class VisionError(RuntimeError):
    pass


class VisionWorker:
    """A long-lived `vision-ocr serve` process.

    Keeping one process alive avoids paying Vision model startup for every
    sampled frame. The helper speaks JSON-lines over stdin/stdout.
    """

    def __init__(self, binary: str | Path = OCR_BINARY):
        self.binary = str(binary)
        self.proc: subprocess.Popen | None = None
        self._buffer = b""
        self._lock = threading.Lock()
        self._stderr: deque[str] = deque(maxlen=30)
        self._started_at = 0.0

    def _drain_stderr(self):
        assert self.proc and self.proc.stderr
        try:
            for raw in self.proc.stderr:
                line = raw.decode("utf-8", "replace").strip()
                if line:
                    self._stderr.append(line)
        except Exception:
            pass

    def start(self):
        if not Path(self.binary).exists():
            raise VisionError("找不到 Vision OCR 组件，请先运行 ./setup.sh 编译")
        self.proc = subprocess.Popen(
            [self.binary, "serve"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=0,
        )
        self._buffer = b""
        self._started_at = time.time()
        threading.Thread(target=self._drain_stderr, daemon=True).start()

    def stop(self):
        proc, self.proc = self.proc, None
        if not proc:
            return
        try:
            if proc.stdin:
                proc.stdin.close()
        except Exception:
            pass
        try:
            proc.terminate()
            proc.wait(timeout=2)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass

    def _read_line(self, timeout: float) -> bytes:
        assert self.proc and self.proc.stdout
        fd = self.proc.stdout.fileno()
        deadline = time.monotonic() + timeout
        while b"\n" not in self._buffer:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise VisionError("OCR 组件响应超时")
            ready, _, _ = select.select([fd], [], [], remaining)
            if not ready:
                raise VisionError("OCR 组件响应超时")
            chunk = os.read(fd, 262144)
            if not chunk:
                raise VisionError("OCR 组件意外退出")
            self._buffer += chunk
        line, self._buffer = self._buffer.split(b"\n", 1)
        return line

    def request(self, payload: dict, timeout: float = 90.0) -> dict:
        with self._lock:
            last_error = None
            for attempt in range(2):
                if not self.proc or self.proc.poll() is not None:
                    self.stop()
                    self.start()
                try:
                    assert self.proc and self.proc.stdin
                    body = json.dumps(payload, ensure_ascii=False).encode("utf-8") + b"\n"
                    self.proc.stdin.write(body)
                    self.proc.stdin.flush()
                    raw = self._read_line(timeout)
                    result = json.loads(raw)
                    if result.get("error"):
                        raise VisionError(result["error"])
                    return result
                except (BrokenPipeError, OSError, VisionError, json.JSONDecodeError) as exc:
                    last_error = exc
                    detail = " / ".join(list(self._stderr)[-3:])
                    self.stop()
                    if attempt == 0 and not isinstance(exc, VisionError):
                        time.sleep(0.15)
                        continue
                    raise VisionError(f"{exc}{(' — ' + detail) if detail else ''}") from exc
            raise VisionError(str(last_error))

    def close(self):
        self.stop()


class VisionEngine:
    """One detector plus a small pool of OCR workers.

    Vision's accurate Chinese model is CPU/Neural-Engine heavy; 3–4 concurrent
    workers give a near-linear speedup on Apple silicon without saturating the
    machine.
    """

    def __init__(self, binary: str | Path = OCR_BINARY, ocr_workers: int = 3):
        self.detect_worker = VisionWorker(binary)
        self.detect_worker.start()
        self.ocr_workers = [VisionWorker(binary) for _ in range(max(1, ocr_workers))]
        for worker in self.ocr_workers:
            worker.start()
        self._pool: queue.Queue[VisionWorker] = queue.Queue()
        for worker in self.ocr_workers:
            self._pool.put(worker)
        self._detect_lock = threading.Lock()
        self._closed = False

    def detect(self, image_path: str | Path) -> list[dict]:
        with self._detect_lock:
            result = self.detect_worker.request({
                "id": "detect",
                "image": str(image_path),
                "mode": "detect",
            })
        return result.get("rects") or []

    def ocr(
        self,
        image_path: str | Path,
        languages: list[str],
        *,
        min_height: float = 0.008,
        level: str = "accurate",
    ) -> dict:
        if self._closed:
            raise VisionError("OCR 引擎已关闭")
        worker = self._pool.get()
        try:
            return worker.request({
                "id": "ocr",
                "image": str(image_path),
                "languages": languages,
                "level": level,
                "minHeight": min_height,
            })
        finally:
            self._pool.put(worker)

    def close(self):
        self._closed = True
        try:
            self.detect_worker.close()
        finally:
            for worker in self.ocr_workers:
                worker.close()

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()
