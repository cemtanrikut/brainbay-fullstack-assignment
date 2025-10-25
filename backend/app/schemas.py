"""
Add conversation_id and history to the chat schema.
"""

from pydantic import BaseModel, Field
from typing import Literal, List, Optional


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatTurnRequest(BaseModel):
    message: str = Field(min_length=1)
    conversation_id: Optional[str] = None  # new


class ChatTurnResponse(BaseModel):
    reply: str
    model: str = "dummy"
    conversation_id: str
    history: List[ChatMessage]
