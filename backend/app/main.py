"""
Step 11:
  - Add GET /api/conversations (list metas)
  - Add GET /api/export/{conversation_id} (full history)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    ChatTurnRequest, ChatTurnResponse, ChatMessage,
    ConversationsResponse, ExportResponse
)
from .chat_service import DummyChatBackend
from .memory import store

app = FastAPI(title="Brainbay API", version="0.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = DummyChatBackend()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/conversations", response_model=ConversationsResponse)
def list_conversations():
    return {"conversations": store.list_conversations()}


@app.get("/api/export/{conversation_id}", response_model=ExportResponse)
def export_conversation(conversation_id: str):
    msgs = store.history(conversation_id)
    if msgs is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"conversation_id": conversation_id, "messages": msgs}


@app.post("/api/chat", response_model=ChatTurnResponse)
def chat_turn(req: ChatTurnRequest):
    if not req.conversation_id:
        cid = store.new_conversation(req.message)
    else:
        cid = req.conversation_id
        store.append(cid, "user", req.message)

    reply = model.generate(store.history(cid))
    store.append(cid, "assistant", reply)

    history = store.history(cid)
    return ChatTurnResponse(
        reply=reply,
        model=model.name,
        conversation_id=cid,
        history=[ChatMessage(**m) for m in history],
    )
