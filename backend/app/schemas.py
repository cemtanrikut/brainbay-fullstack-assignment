from pydantic import BaseModel, Field
from typing import Literal, List, Optional


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatTurnRequest(BaseModel):
    message: str = Field(min_length=1)
    conversation_id: Optional[str] = None


class ChatTurnResponse(BaseModel):
    reply: str
    model: str = "dummy"
    conversation_id: str
    history: List[ChatMessage]


class ConversationMeta(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str


class ConversationsResponse(BaseModel):
    conversations: List[ConversationMeta]


class ExportResponse(BaseModel):
    conversation_id: str
    messages: List[ChatMessage]
