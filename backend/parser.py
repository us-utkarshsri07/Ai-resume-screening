from pdfminer.high_level import extract_text
import docx2txt

def parse_resume(path):
    if path.endswith(".pdf"):
        return extract_text(path)
    elif path.endswith(".docx"):
        return docx2txt.process(path)
    return ""