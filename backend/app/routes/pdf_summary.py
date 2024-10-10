from fastapi import APIRouter, HTTPException, Request
from app.models.summarizer import generate_summary
from app.utils.pdf_parser import pdf_to_text
import requests

router = APIRouter()

@router.post("/summarize")
async def summarize_pdf(request: Request):
    data = await request.json()
    file_url = data.get("fileUrl")
    if not file_url:
        raise HTTPException(status_code=400, detail="File URL is required")

    # Retrieve the PDF from Firebase
    pdf_response = requests.get(file_url)
    if pdf_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Error retrieving the PDF file")

    # Convert PDF to text
    pdf_text = pdf_to_text(pdf_response.content)
    summary = generate_summary(pdf_text)
    return {"summary": summary}
