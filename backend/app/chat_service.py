from typing import Any, Dict, List, Optional

# Lazy import guard: transformers/torch are heavy; only import when needed.
class _Lazy:
    transformers = None
    torch = None


class DummyChatBackend:
    """Extremely small 'model' that returns an echo of the last user message."""

    name = "dummy"

    def generate(self, history: List[Dict[str, Any]], *, params: Optional[Dict[str, Any]] = None) -> str:
        last_user = next((m for m in reversed(history) if m.get("role") == "user"), None)
        user_text = (last_user or {}).get("content", "")
        return f"(echo) You said: {user_text}"


class HFBlenderBackend:
    """
    Hugging Face BlenderBot 400M distilled backend.
    - Lightweight chat model suitable for local CPU inference.
    - Uses conversation history to build a single prompt.
    """

    name = "hf_blender"
    default_model_id = "facebook/blenderbot-400M-distill"

    def __init__(self, model_id: Optional[str] = None):
        self.model_id = model_id or self.default_model_id
        self._pipe = None  # lazy init

    def _ensure_pipeline(self):
        if self._pipe is not None:
            return

        # Lazy import to speed up app startup if this backend isn't selected
        if _Lazy.transformers is None:
            import transformers as _tf
            _Lazy.transformers = _tf

        # NOTE: For CPU usage we keep defaults (fp32). No GPU assumptions.
        self._pipe = _Lazy.transformers.pipeline(
            task="text2text-generation",
            model=self.model_id,
            tokenizer=self.model_id,
            # low memory: small batch, small max length
            # you can tweak below if responses feel short/long
            max_new_tokens=120,
            do_sample=True,
            top_p=0.9,
            temperature=0.8,
        )

    def _render_prompt(self, history: List[Dict[str, Any]]) -> str:
        """
        Render a simple chat transcript to a single input string.
        BlenderBot is seq2seq; a simple concatenation works sufficiently.
        """
        lines: List[str] = []
        for m in history[-10:]:  # keep the prompt short for speed
            role = m.get("role", "user")
            prefix = "User" if role == "user" else "Assistant"
            lines.append(f"{prefix}: {m.get('content','')}")
        lines.append("Assistant:")
        return "\n".join(lines)

    def generate(self, history: List[Dict[str, Any]], *, params: Optional[Dict[str, Any]] = None) -> str:
        self._ensure_pipeline()
        prompt = self._render_prompt(history)

        outputs = self._pipe(prompt)
        # HF pipelines usually return a list of dicts with 'generated_text'
        text = outputs[0]["generated_text"] if outputs else ""
        # In some models 'generated_text' includes the prompt; keep the last line
        # after 'Assistant:' if present, otherwise return as is.
        if "Assistant:" in text:
            text = text.split("Assistant:", maxsplit=1)[-1].strip()
        return text or "(model) I couldn't produce a reply."