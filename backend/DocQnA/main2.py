from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import FakeEmbeddings
from langchain.prompts import PromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser


app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with the domain of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Process the PDF, generate embeddings, store in FAISS, and answer questions using Groq LLM
def process_pdf_and_ask_question_groq(pdf_file: bytes, question: str):
    # Save the uploaded PDF to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
        temp_pdf.write(pdf_file)
        temp_pdf_path = temp_pdf.name

    # Load the PDF document
    file_loader = PyPDFLoader(temp_pdf_path)
    pages = file_loader.load_and_split()

    # Split into chunks using RecursiveCharacterTextSplitter
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=200)
    docs = splitter.split_documents(pages)

    # Generate embeddings
    vector_storage = FAISS.from_documents(docs, FakeEmbeddings(size=1352))

    # Create a retriever
    retriever = vector_storage.as_retriever()

    # Define the question-answering prompt template
    question_template = """
    You are a Smart Bot that answers questions based on the context given to you.
    Return the answer and don't make up things on your own.
    context: {context}
    question: {question}
    """
    prompt = PromptTemplate.from_template(template=question_template)

    # Initialize the Groq model
    parser = StrOutputParser()
    model_name = "llama-3.1-70b-versatile"
    groq_model = ChatGroq(api_key=os.environ["API_KEY"], model_name=model_name, temperature=0)

    # Create the LLM processing chain
    result = RunnableParallel(
        context=retriever,
        question=RunnablePassthrough()
    )
    chain = result | prompt | groq_model | parser

    # Get the answer
    answer = chain.invoke(question)
    print(answer)
    return answer

# Endpoint to handle PDF upload and question-answering
@app.post("/ask_query")
async def ask_question(file: UploadFile = File(...), question: str = Form(...)):
    # Read the PDF file bytes
    file_bytes = await file.read()

    # Process and get the answer
    answer = process_pdf_and_ask_question_groq(file_bytes, question)
    return {"answer": answer}
