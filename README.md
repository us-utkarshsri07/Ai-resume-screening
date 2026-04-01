# AI-Powered Resume Ranking & Decision Support System

## 🎥 Demo Video

https://github.com/us-utkarshri07/Ai-resume-screening/raw/main/Demo1%20.mp4

## Overview

This project is an AI-driven system that automates resume screening and candidate ranking. It combines Large Language Models (LLMs) and semantic embeddings to evaluate candidates based on both skill matching and contextual relevance.

Unlike basic keyword filters, this system provides:

* Hybrid scoring (skills + semantic similarity)
* Explainable rankings
* Adjustable decision weights
* HR-style decision interface (shortlist / reject)

---

## Problem Statement

https://github.com/user-attachments/assets/cb25136f-5930-4bda-a832-974e207c00c1



Traditional resume screening is:

* Time-consuming
* Biased toward keyword matching
* Lacks transparency

This system addresses these issues by introducing:

* Semantic understanding of resumes
* Interpretable scoring
* Configurable evaluation criteria

---

## System Architecture

Resume → Parsing → Skill Extraction (LLM) → Embedding →
→ Skill Matching + Semantic Similarity → Hybrid Scoring → Ranking → Explanation → Decision

---

## Features

### Core AI Features

* LLM-based skill extraction (Qwen2)
* Semantic similarity using embeddings (MiniLM)
* Hybrid scoring model

### Explainability

* Score breakdown (skill vs semantic contribution)
* Human-readable explanations
* Missing skills detection

### Control System

* Adjustable scoring weights
* Real-time re-ranking

### Interface

* Job creation module
* Resume upload
* Candidate ranking dashboard
* Shortlist / Reject actions

---

## Scoring Formula

Final Score = (Skill Score × Weight) + (Semantic Score × Weight)

Weights are dynamically adjustable.

---

## Tech Stack

Frontend:

* React (Vite)
* Axios

Backend:

* FastAPI
* Python

AI Components:

* Qwen2 (LLM for extraction)
* MiniLM (sentence embeddings)

---

## How to Run

### Backend

```bash
cd backend
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

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
7. Shortlist or reject candidates

---

## Key Design Decisions

### Why Hybrid Scoring?

Keyword matching fails to capture context. Semantic similarity complements it.

### Why Explainability?

Recruitment systems require trust and transparency.

### Why Adjustable Weights?

Different roles prioritize different signals (skills vs experience).

---

## Future Improvements

* Persistent storage (DB)
* Resume preview inside UI
* AI-generated detailed explanations
* Skill highlighting inside resumes

---

## Author

[Your Name]

---
