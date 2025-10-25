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
