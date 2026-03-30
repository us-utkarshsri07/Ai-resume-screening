from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

def similarity(job, resume):
    j = model.encode(job).reshape(1, -1)
    r = model.encode(resume).reshape(1, -1)
    return cosine_similarity(j, r)[0][0]