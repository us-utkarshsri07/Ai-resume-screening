# AI-Powered Resume Ranking & Decision Support System

https://github.com/user-attachments/assets/cb25136f-5930-4bda-a832-974e207c00c1

An intelligent system that automates resume screening using Natural Language Processing and Machine Learning. It evaluates candidates based on skill matching and semantic understanding, and provides explainable rankings for better hiring decisions.

## Overview

This project simulates a lightweight AI-based Applicant Tracking System (ATS). It allows recruiters to:

* Create job roles with descriptions and skills
* Upload multiple resumes
* Automatically rank candidates
* Understand *why* a candidate is ranked high or low
* Make decisions (shortlist / reject)

## 📌 Project Structure Explanation

| Folder / File           | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `backend/`              | Core backend logic (FastAPI server + AI pipeline)      |
| `backend/main.py`       | Entry point of FastAPI app (API routes: /rank, /jobs)  |
| `backend/parser.py`     | Extracts text from resumes (PDF parsing)               |
| `backend/llm.py`        | Skill extraction using Qwen2 LLM (Ollama)              |
| `backend/embedding.py`  | Generates embeddings and computes semantic similarity  |
| `backend/ranking.py`    | Skill scoring, hybrid scoring, and ranking logic       |
| `backend/jobs.py`       | Job creation, storage, and retrieval                   |
| `frontend/`             | React frontend (UI + HR dashboard)                     |
| `frontend/src/App.jsx`  | Main UI logic (job selection, upload, results display) |
| `frontend/src/main.jsx` | React app entry point                                  |
| `frontend/public/`      | Static assets (icons, images)                          |
| `resumes/`              | Uploaded resumes (input data)                          |
| `tests/`                | Sample resumes for testing/demo                        |
| `README.md`             | Project documentation                                  |
| `Demo1.mp4`             | Demo video of project                                  |
| `.gitignore`            | Ignore unnecessary files (node_modules, cache, etc.)   |
| `package.json`          | Frontend dependencies and scripts                      |

---

### 🧠 Internal Flow Mapping (Code → Logic)

| Component              | File           |
| ---------------------- | -------------- |
| Resume Parsing         | `parser.py`    |
| Skill Extraction (LLM) | `llm.py`       |
| Semantic Similarity    | `embedding.py` |
| Skill Matching         | `ranking.py`   |
| Hybrid Scoring         | `ranking.py`   |
| Ranking Logic          | `ranking.py`   |
| Job Management         | `jobs.py`      |
| API Layer              | `main.py`      |
| UI Interaction         | `App.jsx`      |

---

### ⚙️ Execution Flow Mapping

```text
User → Frontend (React)
     → FastAPI (main.py)
     → Resume Parsing (parser.py)
     → Skill Extraction (llm.py)
     → Embedding + Similarity (embedding.py)
     → Scoring + Ranking (ranking.py)
     → Response → UI Display
```

---

### 🧩 Notes

* No database is used (jobs stored in-memory / JSON)
* LLM runs locally via Ollama
* System is modular and easily extendable
* Designed for CPU-based execution


## Key Features

### Core Functionality

* Resume parsing (PDF support)
* Skill extraction using LLM (Qwen2)
* Semantic similarity using embeddings (MiniLM)
* Hybrid scoring system
* Candidate ranking
* Explainable AI outputs

### HR Dashboard

* Job creation module
* Job selection dropdown (auto-fill)
* Resume upload interface
* Results table with:

  * Rank
  * Score breakdown
  * Missing skills
  * Explanation
* Shortlist / Reject actions

### Explainability (Important)

* Skill match %
* Semantic match %
* Missing skills
* Human-readable explanation:

  * Strong match
  * Moderate match
  * Weak match

## System Architecture

<p align="center">
  <img src="System Architecture.png" width="100%">
</p>

## Scoring Formula

> [!IMPORTANT]
> 
> Final Score =(Skill Score × Weight) + (Semantic Score × Weight)
>
> Weights are dynamically adjustable.

## Demo Workflow

1. Create a job (title, description, skills)
2. Select job from dropdown
3. Upload resumes
4. Click "Analyze"
5. View ranked candidates
6. Inspect:
   * Scores
   * Explanation
   * Missing skills
8. Shortlist or reject candidates

## Tech Stack

### Frontend

* React (Vite)
* Axios

### Backend

* FastAPI
* Python

### AI / ML

* Qwen2 (LLM via Ollama)
* MiniLM (Sentence Transformers)

### Other

* PDF parsing libraries
* JSON-based storage (no DB)

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/AI-resume-screening.git
cd AI-resume-screening
```

---
### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Run FastAPI server:

```bash
uvicorn main:app --reload
```

---
### 3. Setup Ollama (LLM)

Install Ollama and pull model:

```bash
ollama run qwen2:0.5b
```

Ensure it's running at:

```
http://localhost:11434
```

---
### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Key Design Decisions

### Why Hybrid Scoring?

Keyword matching fails to capture context. Semantic similarity complements it.

### Why Explainability?

Recruitment systems require trust and transparency.

### Why Adjustable Weights?

Different roles prioritize different signals (skills vs experience).

## Use Cases

* HR resume screening
* Campus placements
* Internal hiring automation
* Resume filtering for startups

## Future Improvements

* Persistent storage (DB)
* Resume preview inside UI
* AI-generated detailed explanations
* Skill highlighting inside resumes

---
