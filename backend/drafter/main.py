from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
import os
import tempfile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify the frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize Firebase
try:
    cred = credentials.Certificate('credentials.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization error: {str(e)}")

class Template(BaseModel):
    template: str
    
class DomicileCertificateData(BaseModel):
    name: str
    father_name: str
    address: str
    state: str
    years_of_residence: int
    purpose: str
    issue_date: str
    authority: str

def create_pdf(certificate_text: str, filename: str) -> str:
    """
    Create a PDF file from certificate text
    Returns the path to the generated PDF
    """
    temp_dir = "temp_certificates"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    pdf_path = os.path.join(temp_dir, filename)
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        alignment=TA_CENTER,
        spaceAfter=30,
        fontSize=16,
        bold=True
    )
    
    content_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        alignment=TA_JUSTIFY,
        spaceBefore=12,
        spaceAfter=12,
        fontSize=12,
        leading=16
    )
    
    story = []
    lines = certificate_text.split('\n')
    
    # Process title (first non-empty line)
    for line in lines:
        if line.strip():
            story.append(Paragraph(line.strip(), title_style))
            break
    
    # Process content
    current_paragraph = []
    for line in lines[1:]:
        if line.strip():
            current_paragraph.append(line.strip())
        elif current_paragraph:
            story.append(Paragraph(' '.join(current_paragraph), content_style))
            story.append(Spacer(1, 12))
            current_paragraph = []
    
    # Add any remaining paragraph
    if current_paragraph:
        story.append(Paragraph(' '.join(current_paragraph), content_style))
    
    doc.build(story)
    return pdf_path

@app.post("/store_template/")
async def store_template(template_name: str, template: Template):
    """Store a document template in Firestore"""
    try:
        if not template_name or not template.template:
            raise HTTPException(status_code=400, detail="Template name and content are required")
        
        doc_ref = db.collection("templates").document(template_name)
        doc_ref.set({
            "template": template.template,
            "created_at": datetime.now().isoformat()
        })
        
        return {
            "message": "Template stored successfully",
            "template_name": template_name
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing template: {str(e)}")

@app.get("/templates/{template_name}")
async def get_template(template_name: str):
    """Retrieve a template by name"""
    try:
        doc_ref = db.collection("templates").document(template_name)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Template not found")
            
        return doc.to_dict()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving template: {str(e)}")

@app.post("/generate_domicile_certificate/")
async def generate_domicile_certificate(template_name: str, data: DomicileCertificateData):
    """Generate a certificate using a stored template and provided data"""
    try:
        doc_ref = db.collection("templates").document(template_name)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Template not found")
        
        template_data = doc.to_dict()
        template_text = template_data.get("template")
        
        if not template_text:
            raise HTTPException(status_code=500, detail="Invalid template structure")
        
        try:
            certificate = template_text.format(
                name=data.name,
                father_name=data.father_name,
                address=data.address,
                state=data.state,
                years_of_residence=data.years_of_residence,
                purpose=data.purpose,
                issue_date=data.issue_date,
                authority=data.authority
            )
        except KeyError as ke:
            raise HTTPException(status_code=400, detail=f"Template missing required placeholder: {str(ke)}")
        
        pdf_filename = f"certificate_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = create_pdf(certificate, pdf_filename)
        
        cert_ref = db.collection("certificates").document()
        cert_ref.set({
            "template_name": template_name,
            "certificate_data": data.model_dump(),
            "generated_certificate": certificate,
            "pdf_path": pdf_path,
            "generated_at": datetime.now().isoformat()
        })
        
        return {
            "certificate": certificate,
            "certificate_id": cert_ref.id,
            "pdf_url": f"/download_certificate/{cert_ref.id}"
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating certificate: {str(e)}")

@app.get("/download_certificate/{certificate_id}")
async def download_certificate(certificate_id: str):
    """Download a generated certificate as PDF"""
    try:
        cert_ref = db.collection("certificates").document(certificate_id)
        cert_doc = cert_ref.get()
        
        if not cert_doc.exists:
            raise HTTPException(status_code=404, detail="Certificate not found")
            
        cert_data = cert_doc.to_dict()
        pdf_path = cert_data.get("pdf_path")
        
        if not pdf_path or not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="PDF file not found")
            
        return FileResponse(
            pdf_path, 
            media_type="application/pdf",
            filename=os.path.basename(pdf_path)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading certificate: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        db.collection("templates").limit(1).get()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

@app.on_event("startup")
async def startup_event():
    """Clean up old temporary PDF files on startup"""
    temp_dir = "temp_certificates"
    if os.path.exists(temp_dir):
        for file in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, file)
            try:
                if os.path.isfile(file_path):
                    if datetime.now().timestamp() - os.path.getctime(file_path) > 86400:
                        os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting old file {file_path}: {str(e)}")