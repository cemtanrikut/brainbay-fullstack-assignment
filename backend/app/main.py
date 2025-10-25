"""
Step 9:
  - Integrate in-memory conversation history.
  - /api/chat now creates or updates conversation.
  - Returns conversation_id + history.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ChatTurnRequest, ChatTurnResponse, ChatMessage
from .chat_service import DummyChatBackend
from .memory import store

app = FastAPI(title="Brainbay API", version="0.3.0")

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


@app.post("/api/chat", response_model=ChatTurnResponse)
def chat_turn(req: ChatTurnRequest):
    # Create new conversation if not provided
    if not req.conversation_id:
        cid = store.new_conversation(req.message)
    else:
        cid = req.conversation_id
        store.append(cid, "user", req.message)

    # Generate assistant reply
    reply = model.generate(store.history(cid))
    store.append(cid, "assistant", reply)

    # Return full conversation history
    history = store.history(cid)
    return ChatTurnResponse(
        reply=reply,
        model=model.name,
        conversation_id=cid,
        history=[ChatMessage(**m) for m in history],
    )
