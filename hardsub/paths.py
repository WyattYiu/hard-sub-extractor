from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATIC_DIR = ROOT / "static"
OCR_SOURCE = ROOT / "ocr" / "VisionOCR.swift"
OCR_BINARY = ROOT / "bin" / "vision-ocr"
DATA_DIR = Path(os.environ.get("HARDSUB_DATA", str(ROOT / "data"))).expanduser().resolve()
JOBS_DIR = DATA_DIR / "jobs"

DATA_DIR.mkdir(parents=True, exist_ok=True)
JOBS_DIR.mkdir(parents=True, exist_ok=True)
