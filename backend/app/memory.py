"""
memory.py
-------------------------------------------------------------
In-memory conversation storage.

This keeps a dictionary of conversation_id → list of messages.
For simplicity we use UUIDs as conversation IDs.

Each message is a dict with:
  - role: "user" or "assistant"
  - content: string
-------------------------------------------------------------
"""

from uuid import uuid4
from typing import Dict, List


class InMemoryStore:
    """A super-lightweight conversation store (no persistence)."""

    def __init__(self):
        self._conversations: Dict[str, List[dict]] = {}

    def new_conversation(self, user_message: str) -> str:
        """Create a new conversation and return its ID."""
        cid = uuid4().hex
        self._conversations[cid] = [{"role": "user", "content": user_message}]
        return cid

    def append(self, cid: str, role: str, content: str):
        """Append a new message to an existing conversation."""
        if cid not in self._conversations:
            self._conversations[cid] = []
        self._conversations[cid].append({"role": role, "content": content})

    def history(self, cid: str) -> List[dict]:
        """Return the list of messages for a given conversation."""
        return self._conversations.get(cid, [])

    def all(self) -> Dict[str, List[dict]]:
        """Return all stored conversations (debug only)."""
        return self._conversations


# Create a single global instance
store = InMemoryStore()
