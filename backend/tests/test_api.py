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

def test_chat_conversation_history():
    """Two turns should accumulate four messages (U, A, U, A)."""
    # 1st turn: new conversation
    r1 = client.post("/api/chat", json={"message": "Hi"})
    assert r1.status_code == 200
    d1 = r1.json()
    cid = d1["conversation_id"]
    assert len(d1["history"]) == 2  # user + assistant

    # 2nd turn: same conversation id
    r2 = client.post("/api/chat", json={"conversation_id": cid, "message": "Second"})
    assert r2.status_code == 200
    d2 = r2.json()
    assert d2["conversation_id"] == cid
    assert len(d2["history"]) == 4  # user, assistant, user, assistant

