from pdfminer.high_level import extract_text
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import json

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')


def parse_resume(path):
    return extract_text(path)


import re

def extract_with_qwen(text):
    prompt = f"""
You are a strict JSON generator.

Extract ALL technical skills (programming languages, tools, frameworks).

Return EXACTLY:
{{"skills": ["python", "machine learning", "nlp"]}}

Rules:
- Include programming languages (Python, Java, etc.)
- Include ML/AI terms
- Only JSON
- No explanation

Resume:
{text}
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "qwen2:0.5b",
            "prompt": prompt,
            "stream": False
        }
    )

    output = response.json()["response"]

    try:
        # Extract JSON block from messy output
        json_str = re.search(r"\{.*\}", output, re.DOTALL).group()
        data = json.loads(json_str)

        # Normalize skills (important)
        skills = data.get("skills", [])

        # Handle case where skills are objects instead of strings
        cleaned_skills = []
        for s in skills:
            if isinstance(s, dict):
                cleaned_skills.append(s.get("title", "").lower())
            else:
                cleaned_skills.append(str(s).lower())

        return {"skills": cleaned_skills}

    except Exception as e:
        print("Qwen raw output:", output)
        return {"skills": []}


def similarity(job, resume):
    j = model.encode(job)
    r = model.encode(resume)
    return cosine_similarity([j], [r])[0][0]

def skill_score(job_skills, resume_skills):
    if not job_skills:
        return 0

    matched = len(set(job_skills) & set(resume_skills))
    return matched / len(job_skills)



# ===== TEST RUN =====

resume_text = parse_resume("resume.pdf")   # put a sample resume here

data = extract_with_qwen(resume_text)
skills = data.get("skills", [])

job_desc = "Looking for a Python Machine Learning Engineer with NLP experience"

# Define required job skills
job_skills = ["python", "machine learning", "nlp"]

# Calculate scores
s_score = skill_score(job_skills, skills)
sem_score = similarity(job_desc, resume_text)

final = 0.6 * sem_score + 0.4 * s_score

# Output
print("Extracted Skills:", skills)
print("Skill Score:", s_score)
print("Semantic Score:", sem_score)
print("Final Score:", final)