import json
import os

JOB_FILE = "jobs.json"

def load_jobs():
    if not os.path.exists(JOB_FILE):
        return []
    with open(JOB_FILE, "r") as f:
        return json.load(f)

def save_jobs(jobs):
    with open(JOB_FILE, "w") as f:
        json.dump(jobs, f, indent=2)

def add_job(job):
    jobs = load_jobs()
    job["id"] = len(jobs) + 1
    jobs.append(job)
    save_jobs(jobs)
    return job