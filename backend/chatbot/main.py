from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import uuid
import logging

from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory, BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from fastapi.middleware.cors import CORSMiddleware

# Set up logging for debugging purposes
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq and ChatGroq
Model = "llama-3.1-70b-versatile"
model = ChatGroq(api_key=os.environ["API_KEY"], model_name=Model, temperature=0)
parser = StrOutputParser()

# Store for session message history
store = {}

# Function to get or create the session history
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

# Wrap the model with RunnableWithMessageHistory
with_message_history = RunnableWithMessageHistory(model, get_session_history)

class ChatMessage(BaseModel):
    sender: str
    content: str

class QueryRequest(BaseModel):
    query: str
    session_id: str
    new_chat: bool = False  # Indicates whether to start a new chat or continue

# Process a legal query
@app.post("/process_query")
def process_legal_query(request: QueryRequest):
    logger.info(f"Processing query: {request.query} for session: {request.session_id}")

    # Check if session_id is valid
    if not request.session_id:
        logger.error("Session ID is missing.")
        raise HTTPException(status_code=400, detail="Session ID is required.")

    # Start a new session if specified
    if request.new_chat:
        request.session_id = str(uuid.uuid4())
        store[request.session_id] = InMemoryChatMessageHistory()  # Create a new chat history
        logger.info(f"Started new chat with session ID: {request.session_id}")

    prompt_template = PromptTemplate(
        input_variables=["query"],
        template="""You are an Indian legal assistant chatbot. Based on the following legal question, give a human-like response:
        
        Question: {query}
        
        Response:
        """
    )

    final_prompt = prompt_template.format(query=request.query)
    config = {"configurable": {"session_id": request.session_id}}

    try:
        # Retrieve session history and add the user's message
        session_history = get_session_history(request.session_id)
        session_history.add_user_message(request.query)  # Store the user's query in history

        # Invoke the model with message history
        response = with_message_history.invoke(
            [HumanMessage(content=final_prompt)],
            config=config,
        )
        
        logger.info(f"Model response: {response.content}")
        return {"response": response.content, "session_id": request.session_id}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail="An internal server error occurred. Please try again later.")

# Start a new chat
@app.post("/new_chat")
def start_new_chat():
    session_id = str(uuid.uuid4())
    logger.info(f"New chat started with session ID: {session_id}")
    store[session_id] = InMemoryChatMessageHistory()  # Initialize new chat history
    return {"session_id": session_id}

# Save chat history
@app.post("/save_chat/{session_id}")
def save_chat(session_id: str, chat_history: list[ChatMessage]):
    if session_id not in store:
        logger.warning(f"Session ID {session_id} not found. Creating new history.")

    # Create a new InMemoryChatMessageHistory for the chat history
    new_history = InMemoryChatMessageHistory()
    for message in chat_history:
        new_history.add_user_message(message.content) if message.sender == "user" else new_history.add_ai_message(message.content)

    store[session_id] = new_history
    logger.info(f"Chat history saved for session ID: {session_id}")
    return {"message": "Chat history saved successfully"}

# Get chat history for a session
@app.get("/get_chat_history/{session_id}")
def get_chat_history(session_id: str):
    if session_id not in store:
        logger.warning(f"Chat history requested for non-existent session ID: {session_id}")
        raise HTTPException(status_code=404, detail="Session ID not found.")

    chat_history = store[session_id].messages  # Access the messages directly
    logger.info(f"Retrieved chat history for session ID: {session_id}")
    return {"chat_history": chat_history}