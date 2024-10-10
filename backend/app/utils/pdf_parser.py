import fitz  # PyMuPDF

def pdf_to_text(pdf_data):
    doc = fitz.open(stream=pdf_data, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text
