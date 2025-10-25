"""
Minimal smoke tests for the Brainbay FastAPI app.

- Verifies /api/health returns {"status": "ok"}.
- Verifies /api/chat echoes user input via the dummy backend.
"""

from fastapi.testclient import TestClient
from backend.app.main import app  # Import the same app instance

client = TestClient(app)


def test_health_ok():
    """Health endpoint should return status=ok."""
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_chat_echo():
    """Chat endpoint should echo the provided message."""
    payload = {"message": "Hello Brainbay"}
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    # Response contract
    assert "reply" in data
    assert "model" in data
    assert data["model"] == "dummy"

    # Behavior
    assert "Hello Brainbay" in data["reply"]
    assert data["reply"].startswith("(echo)")
