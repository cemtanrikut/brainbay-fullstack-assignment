# 🧠 Brainbay Full-stack AI Assistant

A minimal, production-ready scaffold for the Brainbay full-stack assignment. This full-stack AI assistant includes a React (Vite) frontend, a FastAPI backend with pluggable chat backends, Docker Compose orchestration with Nginx, basic tests, and a clean, documented architecture.

---

## 📑 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started-development)
- [Docker Setup](#-docker--compose-single-entry)
- [API Reference](#-api-surface)
- [Chat Backends](#-chat-backends)
- [Testing](#-tests)
- [Code Quality](#-code-quality-frontend)
- [Configuration](#-configuration)
- [Architecture](#-architectural-notes)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

### **Frontend (React + Vite)**

- Minimal chat UI with conversation list, scrollable messages, and fixed composer
- Conversation create/select/delete/clear
- Modern styling without heavy UI libraries
- Clean component structure with API wrapper

### **Backend (FastAPI)**

- REST API endpoints under `/api`
- In-memory conversation history
- Switchable chat backends (`dummy` or `hf_blender`)
- Lightweight Pydantic-based schema validation

### **Tooling**

- **Frontend**: ESLint, Prettier, Husky, lint-staged
- **Backend**: Pytest smoke tests
- **Docker Compose**: Unified app entry at `http://localhost:8080` via Nginx

---

## 🗂 Project Structure

```
backend/
  app/
    chat_service.py      # Chat backends (Dummy, HF BlenderBot)
    main.py              # FastAPI app + routes
    memory.py            # In-memory conversation store
    schemas.py           # Pydantic models
  tests/
    test_api.py          # Basic backend smoke tests
  requirements.txt
  Dockerfile

frontend/
  src/
    components/          # Chat UI components
    lib/                 # API helper
    styles.css
    App.jsx              # Main frontend wiring
  .env.development
  .env.production
  Dockerfile
  nginx.conf
  package.json

scripts/
  docker-up.sh
  backend/scripts/test-backend.sh

docker-compose.yml
.dockerignore
```

---

## 🚀 Getting Started (Development)

### **Prerequisites**

- Node.js 18+ (tested with Node 20)
- Python 3.12
- Docker 24+ (optional)

---

### **1. Backend Setup**

```bash
pip3 install -r backend/requirements.txt
export MODEL_BACKEND=dummy           # Or: hf_blender
export CORS_ORIGINS=http://localhost:5173
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

**Health Check:**

```bash
curl http://localhost:8000/api/health
# → {"status":"ok","backend":"dummy"}
```

---

### **2. Frontend Setup**

```bash
cd frontend
cp .env.development .env
npm ci
npm run dev
# → http://localhost:5173
```

---

## 🐳 Docker / Compose (Single Entry)

```bash
bash scripts/docker-up.sh
# or: docker compose up --build
```

**Visit:** [http://localhost:8080](http://localhost:8080)

- Nginx serves the frontend and proxies `/api/*` to the backend
- Backend configuration (e.g., `MODEL_BACKEND`) is set in `docker-compose.yml`

---

## 🔌 API Surface

| Method | Endpoint                    | Description                                 |
|--------|-----------------------------|---------------------------------------------|
| GET    | `/api/health`               | Returns API status and active backend       |
| POST   | `/api/chat`                 | Sends a message and receives model response |
| GET    | `/api/conversations`        | Lists saved conversations                   |
| GET    | `/api/export/{id}`          | Exports conversation with messages          |
| DELETE | `/api/conversations/{id}`   | Deletes a specific conversation             |
| DELETE | `/api/conversations`        | Clears all conversations                    |

**Message Format**:

```json
{
  "message": "Hello",
  "conversation_id": "optional-id"
}
```

**Reply Format**:

```json
{
  "reply": "...",
  "model": "hf_blender",
  "conversation_id": "...",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

---

## 🧠 Chat Backends

### **DummyChatBackend**
- Echoes the last user message
- Ideal for development and testing
- Set via `MODEL_BACKEND=dummy`

### **HFBlenderBackend**
- Uses `facebook/blenderbot-400M-distill` (CPU-friendly)
- No GPU required
- Reduces history into a single prompt input
- Set via `MODEL_BACKEND=hf_blender`

**Install PyTorch (if needed):**

```bash
pip install --index-url https://download.pytorch.org/whl/cpu torch
```

---

## 🧪 Tests

### **Backend Smoke Tests**

```bash
pip3 install -r backend/requirements.txt
bash backend/scripts/test-backend.sh
# .. [100%]
```

---

## 🧼 Code Quality (Frontend)

```bash
npm run lint          # Run ESLint
npm run format        # Prettier auto-format
npm run format:check  # Prettier format check
```

Pre-commit hook via Husky runs `lint-staged`:

- JS/JSX → `eslint --fix`
- CSS/MD/JSON → `prettier --write`

---

## 🧰 Configuration

### **Frontend**

| Environment | File                   | Description                         |
|-------------|------------------------|-------------------------------------|
| Dev         | `.env.development`     | `VITE_API_URL=http://localhost:8000`|
| Prod        | `.env.production`      | Empty → proxies to backend via Nginx|

### **Backend**

| Variable         | Purpose                                      |
|------------------|----------------------------------------------|
| MODEL_BACKEND    | `dummy` or `hf_blender`                      |
| CORS_ORIGINS     | Allowed origins (comma-separated URLs)       |

---

## 🧭 Architectural Notes

### **Backend**

- `chat_service.py`: Abstracts backend logic (echo/HF)
- `memory.py`: In-memory conversation store (can be replaced by DB)
- `schemas.py`: Pydantic models for clean route handling

### **Frontend**

- `App.jsx`: Manages global state (conversations, messages)
- `Sidebar`: Conversation selection + deletion
- `ChatBox`: Message composer with auto-scroll and focus
- **Styling**: CSS-only layout using Grid/Flexbox

---

## 🧩 Troubleshooting

### **Composer Not Sticking to Bottom**
Ensure:
```css
.content { grid-template-rows: auto 1fr; min-height: 0; }
.chat-panel { grid-template-rows: auto 1fr auto; height: <fixed or clamp>; }
.messages { min-height: 0; overflow-y: auto; }
```

### **Sidebar Not Updating**
- Confirm `onConversationUpdate` is called after `sendChat()`
- Check `/api/conversations` in the browser

### **HF Model Too Slow**
- Use `MODEL_BACKEND=dummy` for dev
- Reduce `max_new_tokens` or `temperature` in `HFBlenderBackend`

---

## ✅ Submission Checklist

- ✅ Self-contained Docker Compose setup
- ✅ No external dependencies beyond Docker
- ✅ Clean, commented codebase
- ✅ Minimal but extendable tests
- ✅ Logical project structure and commit history

---

## 📜 License

For assessment use only.
