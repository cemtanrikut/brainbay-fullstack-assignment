"""
Chat backend abstraction.
We start with a dummy echo implementation to keep the step minimal.
Later we can swap this with a real HF model driver without touching routes.
"""

from typing import Dict, Any


class DummyChatBackend:
    """
    Extremely small 'model' that returns an echo of the last user message.
    Useful for wiring, smoke tests, and CI without heavy deps.
    """

    name = "dummy"

    def generate(self, message: str, *, params: Dict[str, Any] | None = None) -> str:
        # params is reserved for future generation controls (temperature, etc.)
        return f"(echo) You said: {message}"
