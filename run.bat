@echo off

echo Starting Backend...
start cmd /k "cd backend && python -m uvicorn main:app --reload"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Starting Ollama (if not already running)...
start cmd /k "ollama serve"

echo All services started!
pause