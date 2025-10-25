"""
memory.py
-------------------------------------------------------------
Add lightweight metadata to support conversation listing:
- id -> messages (existing)
- id -> meta {title, created_at, updated_at} (new)
"""

from uuid import uuid4
from typing import Dict, List
from datetime import datetime


class InMemoryStore:
    """A super-lightweight conversation store (no persistence)."""

    def __init__(self):
        self._conversations: Dict[str, List[dict]] = {}
        self._meta: Dict[str, dict] = {}

    def _touch_meta(self, cid: str, *, first_user_message: str | None = None):
        """Create or update conversation metadata."""
        now = datetime.utcnow().isoformat()
        if cid not in self._meta:
            title_source = (first_user_message or "").strip()
            title = title_source[:40] + ("…" if len(title_source) > 40 else "")
            if not title:
                title = "New chat"
            self._meta[cid] = {
                "id": cid,
                "title": title,
                "created_at": now,
                "updated_at": now,
            }
        else:
            self._meta[cid]["updated_at"] = now

    def new_conversation(self, user_message: str) -> str:
        """Create a new conversation and return its ID."""
        cid = uuid4().hex
        self._conversations[cid] = [{"role": "user", "content": user_message}]
        self._touch_meta(cid, first_user_message=user_message)
        return cid

    def append(self, cid: str, role: str, content: str):
        """Append a new message to an existing conversation."""
        if cid not in self._conversations:
            self._conversations[cid] = []
            self._touch_meta(cid, first_user_message=content if role == "user" else None)
        self._conversations[cid].append({"role": role, "content": content})
        self._touch_meta(cid)

    def history(self, cid: str) -> List[dict]:
        """Return the list of messages for a given conversation."""
        return self._conversations.get(cid, [])

    def list_conversations(self) -> List[dict]:
        """Return minimal metadata for all conversations (sorted by updated_at desc)."""
        items = list(self._meta.values())
        # Sort by updated_at (newest first)
        return sorted(items, key=lambda m: m["updated_at"], reverse=True)

# Create a single global instance for import convenience
store = InMemoryStore()