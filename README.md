# AI Resume Screening System

A full-stack AI system that analyzes and ranks resumes based on a given job description.

---

## Features

- Upload multiple resumes (PDF)
- Extract technical skills using LLM (Qwen2-0.5B)
- Compute semantic similarity using MiniLM
- Rank candidates based on relevance
- Simple React-based UI

---

## Tech Stack

- Backend: FastAPI (Python)
- Frontend: React (Vite)
- LLM: Qwen2-0.5B (via Ollama)
- Embeddings: all-MiniLM-L6-v2

---

## How it Works

1. User uploads resumes and enters job description  
2. Backend parses PDF files  
3. Qwen extracts technical skills  
4. MiniLM computes similarity score  
5. System ranks candidates based on final score  
6. Results displayed in UI  

---

## Project Structure



---

## Run Locally

### Backend

```bash
cd backend
python -m uvicorn main:app --reload

