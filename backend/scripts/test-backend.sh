#!/usr/bin/env bash
# Run backend tests from anywhere
set -euo pipefail

# go to repo root
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

export PYTHONPATH="$ROOT_DIR:${PYTHONPATH:-}"

pytest -q backend/tests
