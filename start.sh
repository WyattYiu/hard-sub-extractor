#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
./setup.sh
exec python3 app.py --open "$@"
