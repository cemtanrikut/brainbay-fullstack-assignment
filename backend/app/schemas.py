"""
Pydantic models (request/response DTOs) for the chat API.
Keeping them in a separate module keeps main.py lean and testable.
"""

from pydantic import BaseModel, Field
from typing import Literal


class ChatTurnRequest(BaseModel):
    """
    Minimal request for a chat turn.
    For now, we only support a single user message.
    """
    message: str = Field(min_length=1, description="User input text")


class ChatTurnResponse(BaseModel):
    """
    Minimal response including the assistant's reply.
    """
    reply: str
    model: str = "dummy"
