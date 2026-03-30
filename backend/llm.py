import requests
import json
import re

def normalize_skill(skill):
    skill = skill.lower()

    mapping = {
        "ml": "machine learning",
        "dl": "deep learning",
        "ai": "artificial intelligence"
    }

    return mapping.get(skill, skill)

def extract_with_qwen(text):

    prompt = f"""
You are a strict JSON generator.

Extract ALL technical skills.

Return EXACTLY:
{{"skills": ["python", "ml"]}}

Only JSON.

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
        json_str = re.search(r"\{.*\}", output, re.DOTALL).group()
        data = json.loads(json_str)

        skills = data.get("skills", [])
        normalized_skills = [normalize_skill(str(s)) for s in skills]
        return {"skills": normalized_skills}
    except:
        return {"skills": []}