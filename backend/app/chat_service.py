"""
Chat backend abstraction.
We start with a dummy echo implementation to keep the step minimal.
Later we can swap this with a real HF model driver without touching routes.
"""
from typing import Any, Dict, List


class DummyChatBackend:
    """
    Extremely small 'model' that returns an echo of the last user message.
    Useful for wiring, smoke tests, and CI without heavy deps.
    """

    name = "dummy"

    def generate(self, history: List[Dict[str, Any]], *, params: Dict[str, Any] | None = None) -> str:
        """
        Accept the full conversation history (list of dicts with 'role'/'content'),
        find the last user message, and echo it back.
        """
        last_user = next((m for m in reversed(history) if m.get("role") == "user"), None)
        user_text = (last_user or {}).get("content", "")
        return f"(echo) You said: {user_text}"
