#!/usr/bin/env bash
# -------------------------------------------------------------
# Purpose:
#   Create a minimal Vite + React frontend scaffold.
# Usage:
#   bash scripts/setup-frontend.sh
# Notes:
#   - Requires Node.js >= 18 (Node 20 recommended)
#   - Only installs and sets up the "frontend" folder.
# -------------------------------------------------------------

set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "[!] Node.js is not installed. Please install Node 18+."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[!] npm is not installed."
  exit 1
fi

if [ -d "frontend" ]; then
  echo "[i] 'frontend' folder already exists. Skipping scaffold."
else
  echo "[i] Creating new Vite + React project..."
  npm create vite@latest frontend -- --template react
fi

cd frontend
echo "[i] Installing dependencies..."
npm install

echo ""
echo "[✓] Frontend setup complete!"
echo "Run the development server with:"
echo "  cd frontend && npm run dev"
echo "Then open http://localhost:5173"
