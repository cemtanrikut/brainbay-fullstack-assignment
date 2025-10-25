#!/usr/bin/env bash
# -------------------------------------------------------------
# Purpose:
#   Create a minimal FastAPI backend for Step 4 and install deps.
# Usage:
#   bash scripts/setup-backend.sh
# Notes:
#   - Uses system Python. If you prefer venv:
#       python3 -m venv .venv && source .venv/bin/activate
# -------------------------------------------------------------

set -euo pipefail

# Create folders if missing
mkdir -p backend/app

# Ensure requirements.txt exists (idempotent write)
cat > backend/requirements.txt <<'REQ'
fastapi==0.115.0
uvicorn[standard]==0.30.5
pydantic==2.9.2
REQ

# Ensure main.py exists (idempotent write)
if [ ! -f backend/app/main.py ]; then
  cat > backend/app/main.py <<'PY'
"""
Minimal FastAPI application for the Brainbay assignment.

Endpoints:
  - GET /api/health: returns a basic liveness probe.

Notes:
  - CORS is enabled for http://localhost:5173 (Vite dev server),
    so the frontend can call the API during development.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Brainbay API", version="0.1.0")

# Allow the Vite dev server during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    """Return a minimal health payload to verify the API is alive."""
    return {"status": "ok"}
PY
fi

echo "[i] Installing backend dependencies..."
pip3 install -r backend/requirements.txt

cat <<'EOF'

[✓] Backend setup complete.

Run the API locally:
  uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

Test in another terminal:
  curl http://localhost:8000/api/health
  # => {"status":"ok"}

EOF
