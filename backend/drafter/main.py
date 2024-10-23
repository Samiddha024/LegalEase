import os
from typing import List, Dict, Any 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_core.output_parsers import StrOutputParser
from docx import Document
from reportlab.pdfgen import canvas
import json

#Hiiiii
Model = "llama-3.1-70b-versatile"
model = ChatGroq(api_key=os.environ["API_KEY"], model_name=Model, temperature=0)
parser = StrOutputParser()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_document")
async def generate_document(request: Dict[str, Any]) -> Dict[str, str]: 
    case_details = request.get("case_details", "")
    ipc_sections = request.get("ipc_sections", [])

    if not case_details or not ipc_sections:
        raise HTTPException(status_code=400, detail="Missing case details or IPC sections")

    prompt = PromptTemplate(
        input_variables=["case_details", "ipc_sections"],
        template="Draft a legal document for the following case:\n\nCase Details: {case_details}\n\nRelevant IPC Sections: {ipc_sections}\n\nPlease provide a well-structured legal document based on Indian laws and the given IPC sections."
    )
    
    chain = LLMChain(llm=model, prompt=prompt, output_parser=parser)
    
    result = chain.run(case_details=case_details, ipc_sections=", ".join(ipc_sections))
    
    return {"document_content": result}

@app.post("/edit_document")
async def edit_document(request: Dict[str, str]) -> Dict[str, str]:
    document_content = request.get("document_content", "")

    if not document_content:
        raise HTTPException(status_code=400, detail="Missing document content")

    return {"document_content": document_content}

@app.post("/export_document")
async def export_document(request: Dict[str, str], format: str) -> Dict[str, str]:
    document_content = request.get("document_content", "")

    if not document_content:
        raise HTTPException(status_code=400, detail="Missing document content")

    if format not in ["pdf", "docx"]:
        raise HTTPException(status_code=400, detail="Unsupported format. Use 'pdf' or 'docx'.")
    
    if format == "pdf":
        c = canvas.Canvas("document.pdf")
        c.drawString(100, 750, document_content)
        c.save()
        return {"message": "PDF generated successfully"}
    else:
        doc = Document()
        doc.add_paragraph(document_content)
        doc.save("document.docx")
        return {"message": "DOCX generated successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
