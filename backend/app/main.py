"""
Minimal FastAPI application for the Brainbay assignment.

Endpoints:
  - GET /api/health : liveness probe
  - POST /api/chat  : chat turn (dummy echo for now)

Notes:
  - CORS is enabled for http://localhost:5173 (Vite dev server).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import ChatTurnRequest, ChatTurnResponse
from .chat_service import DummyChatBackend

app = FastAPI(title="Brainbay API", version="0.2.0")

# Allow the Vite dev server during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire a tiny 'model' instance (dummy for this step)
model = DummyChatBackend()


@app.get("/api/health")
def health():
    """Return a minimal health payload to verify the API is alive."""
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatTurnResponse)
def chat_turn(req: ChatTurnRequest) -> ChatTurnResponse:
    """
    Accept a single user message and return a dummy echo reply.
    This keeps the contract very small while we wire the pipeline.
    """
    reply = model.generate(req.message)
    return ChatTurnResponse(reply=reply, model=model.name)
