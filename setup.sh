#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

echo "==> 检查运行环境"
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "这个工具使用 macOS 原生 Vision OCR，目前只支持 macOS。" >&2
  exit 1
fi
if [[ "$(uname -m)" != "arm64" ]]; then
  echo "提示：当前不是 Apple silicon，仍可运行，但速度可能较慢。"
fi

PYTHON="${PYTHON:-python3}"
if ! command -v "$PYTHON" >/dev/null 2>&1; then
  echo "找不到 python3，请先安装 Python 3.10+。" >&2
  exit 1
fi
"$PYTHON" - <<'PY'
import sys
if sys.version_info < (3, 10):
    raise SystemExit("需要 Python 3.10 或更高版本")
print(f"Python {sys.version.split()[0]}")
PY

if ! "$PYTHON" -c "import flask, numpy, PIL, opencc" >/dev/null 2>&1; then
  echo "==> 安装 Python 依赖"
  "$PYTHON" -m pip install -r requirements.txt
else
  echo "==> Python 依赖已就绪"
fi

if ! command -v ffmpeg >/dev/null 2>&1 && [[ ! -x "$HOME/ffmpeg/bin/ffmpeg" ]]; then
  echo "找不到 ffmpeg。请先运行：brew install ffmpeg" >&2
  exit 1
fi

if ! command -v swiftc >/dev/null 2>&1; then
  echo "找不到 swiftc。请安装 Xcode Command Line Tools：xcode-select --install" >&2
  exit 1
fi

mkdir -p bin data/jobs
BUILD_OCR=0
if [[ ! -x bin/vision-ocr || ocr/VisionOCR.swift -nt bin/vision-ocr ]]; then
  BUILD_OCR=1
elif ! ./bin/vision-ocr languages >/dev/null 2>&1; then
  BUILD_OCR=1
fi
if [[ "$BUILD_OCR" == "1" ]]; then
  echo "==> 编译 Apple Vision OCR 组件"
  swiftc -O ocr/VisionOCR.swift -o bin/vision-ocr \
    -framework Vision -framework ImageIO -framework CoreGraphics -framework Foundation
else
  echo "==> Vision OCR 组件已就绪"
fi

chmod +x bin/vision-ocr start.sh 2>/dev/null || true
echo "==> 准备完成。运行 ./start.sh 启动界面。"
