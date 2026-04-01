from typing import List
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.parser import parse_resume
from backend.llm import extract_with_qwen
from backend.embedding import similarity
from backend.ranking import skill_score, final_score
from backend.jobs import load_jobs, add_job
from fastapi.responses import FileResponse

def normalize(skills):
    return [s.strip().lower() for s in skills]

import difflib

def is_present(skill, text):

    if skill in text:
        return all(w in text for w in skill.split())
    words = text.split()
    return any(difflib.SequenceMatcher(None, skill, w).ratio() > 0.8 
               for w in words)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# 1 resume analysis

@app.post("/analyze")
async def analyze_resume(
    files: List[UploadFile] = File(...),
    job_desc: str = Form(...),
    job_skills: str = Form(...)
):
    job_skills_list = normalize ( job_skills.split(","))
    results = []

    for file in files:
        path = f"{UPLOAD_DIR}/{file.filename}"

        with open(path, "wb") as f:
            f.write(await file.read())

        text = parse_resume(path)
        data = extract_with_qwen(text)

        skills = normalize(data.get("skills", []) if isinstance(data, dict) else [])

        s_score = float(skill_score(job_skills_list, skills))
        sem_score = float(similarity(job_desc, text))
        final = float(final_score(s_score, sem_score))

        results.append({
            "name": file.filename,
            "skills": skills,
            "score": final
        })

    return {"results": results}



# MULTI RESUME RANKING (MAIN)

@app.post("/rank")
async def rank_resumes(
    job_desc: str = Form(...),
    job_skills: str = Form(...),
    files: List[UploadFile] = File(...)
):
    job_skills_list = [s.strip().lower() for s in job_skills.split(",")]
    results = []

    for file in files:
        path = f"{UPLOAD_DIR}/{file.filename}"

        with open(path, "wb") as f:
            f.write(await file.read())

        text = parse_resume(path)
        data = extract_with_qwen(text)

        skills = normalize(data.get("skills", []) if isinstance(data, dict) else [])

        s_score = float(skill_score(job_skills_list, skills))
        sem_score = float(similarity(job_desc, text))
        final = float(final_score(s_score, sem_score))

        resume_text_lower = text.lower()

        missing = [
            skill for skill in job_skills_list 
            if not is_present(skill, resume_text_lower)
        ]

        results.append({
            "name": file.filename,
            "skills": skills,
            "score": float(final),
            "skill_score": float(s_score),
            "semantic_score": float(sem_score),
            "missing_skills": missing
        })

    # SORT + RANK
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    for i, r in enumerate(results):
        r["rank"] = i + 1

    return {"ranking_candidates": results}



# JOB MODULE

@app.post("/jobs")
async def create_job(
    title: str = Form(...),
    description: str = Form(...),
    skills: str = Form(...)
):
    job = {
        "title": title,
        "description": description,
        "skills": [s.strip().lower() for s in skills.split(",")]
    }
    return add_job(job)


@app.get("/jobs")
async def get_jobs():
    return {"jobs": load_jobs()}

@app.get("/resumes/{filename}")
async def get_resume(filename: str):
    path = f"{UPLOAD_DIR}/{filename}"
    return FileResponse(path)