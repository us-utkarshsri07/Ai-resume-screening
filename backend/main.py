from ast import List

from fastapi import FastAPI, UploadFile
import os
from backend.parser import parse_resume
from backend.llm import extract_with_qwen
from backend.embedding import similarity
from backend.ranking import skill_score, final_score


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/analyze")
async def analyze_resume(file: UploadFile, job_desc: str):

    path = f"{UPLOAD_DIR}/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    # Step 1: parse
    text = parse_resume(path)

    # Step 2: LLM extraction
    data = extract_with_qwen(text)
    skills = data.get("skills", [])

    # Example job skills (can come from UI later)
    job_skills = ["python", "machine learning", "nlp"]

    # Step 3: scoring
    s_score = skill_score(job_skills, skills)
    sem_score = similarity(job_desc, text)
    final = final_score(s_score, sem_score)

    return {
    "skills": skills,
    "skill_score": float(s_score),
    "semantic_score": float(sem_score),
    "final_score": float(final)
}


from fastapi import File,Form
from typing import List


@app.post("/rank")
async def rank_resumes(
    job_desc: str=Form(...),
    files: List[UploadFile] = File(...)
):

    results = []

    job_skills = ["python", "machine learning", "nlp"]

    for file in files:

        path = f"{UPLOAD_DIR}/{file.filename}"

        with open(path, "wb") as f:
            f.write(await file.read())

        # Parse
        text = parse_resume(path)

        # Extract skills
        data = extract_with_qwen(text)
        skills = data.get("skills", [])

        # Scores
        s_score = skill_score(job_skills, skills)
        sem_score = similarity(job_desc, text)
        final = final_score(s_score, sem_score)
        print("FILES RECEIVED:", len(files))

        results.append({
            "name": file.filename,
            "skills": skills,
            "score": float(final)
        })

    # Sort by score (descending)
    results = sorted(results, key=lambda x: x["score"], reverse=True)
    for i, r in enumerate(results):
        r["rank"] = i + 1
        print(f"Rank {i + 1}: {r['name']} - Score: {r['score']}")

    return {"ranking": results}
    