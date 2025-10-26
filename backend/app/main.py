import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    ChatTurnRequest, ChatTurnResponse, ChatMessage,
    ConversationsResponse, ExportResponse,
)
from .chat_service import DummyChatBackend, HFBlenderBackend
from .memory import store

app = FastAPI(title="Brainbay API", version="0.7.0")

origins = os.getenv("CORS_ORIGINS", "*")
allow_origins = [o.strip() for o in origins.split(",")] if origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Select model backend
_backend = os.getenv("MODEL_BACKEND", "dummy").lower()
if _backend == "hf_blender":
    model = HFBlenderBackend()
else:
    model = DummyChatBackend()


@app.get("/api/health")
def health():
    return {"status": "ok", "backend": getattr(model, "name", "unknown")}


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
        model=getattr(model, "name", "unknown"),
        conversation_id=cid,
        history=[ChatMessage(**m) for m in history],
    )
