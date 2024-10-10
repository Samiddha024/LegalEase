from fastapi import FastAPI, HTTPException, Request
import requests
from fastapi.middleware.cors import CORSMiddleware
from transformers import PegasusTokenizer, AutoModelForSeq2SeqLM
import fitz  # PyMuPDF

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Specify origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load the tokenizer and model
tokenizer = PegasusTokenizer.from_pretrained("google/pegasus-large")
model = AutoModelForSeq2SeqLM.from_pretrained("Suyogp/fine-tuned-legal-summarizer")

def generate_summary(text: str) -> str:
    print("1")
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=1024)
    print("2")
    summary_ids = model.generate(inputs.input_ids, max_length=150, min_length=30, length_penalty=2.0, num_beams=4, early_stopping=True)
    print("3")
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    print("4")
    return summary

def pdf_to_text(pdf_data: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_data, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text("text")
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/summarize")
async def summarize_pdf(request: Request):
    data = await request.json()
    print(data)
    file_url = data['docURL']
    
    if not file_url:
        raise HTTPException(status_code=400, detail="File URL is required")

    # Retrieve the PDF from Firebase
    try:
        pdf_response = requests.get(file_url)
        print(pdf_response)
        pdf_response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.HTTPError as http_err:
        raise HTTPException(status_code=400, detail=f"Error retrieving the PDF file: {str(http_err)}")
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Error retrieving the PDF file: {str(err)}")

    # Convert PDF to text
    print("hello.... pdf text generating")
    pdf_text = pdf_to_text(pdf_response.content)
    print(pdf_text)

    # Generate summary
    if not pdf_text.strip():
        raise HTTPException(status_code=400, detail="PDF contains no text")
    print("before summary.....")
    summary = generate_summary(pdf_text)
    print(summary)
    return {"summary": summary}
