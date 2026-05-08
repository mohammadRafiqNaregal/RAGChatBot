# Enterprise Knowledge Assistant

Initial scaffold for a FastAPI backend and React frontend based on the technical implementation guide.

## Project Structure

- `backend`: FastAPI service
- `frontend`: React + Vite app

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on <http://localhost:5173> and backend on <http://localhost:8000>.
