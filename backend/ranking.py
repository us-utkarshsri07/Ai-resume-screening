def skill_score(job_skills, resume_skills):
    if not job_skills:
        return 0

    matched = len(set(job_skills) & set(resume_skills))
    return matched / len(job_skills)


def final_score(skill, semantic):
    return 0.6 * semantic + 0.4 * skill