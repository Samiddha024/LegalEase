import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your FastAPI server URL

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [previousSessions, setPreviousSessions] = useState([]);

  useEffect(() => {
    startNewChat();
  }, []);

  const startNewChat = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/new_chat`);
      setCurrentSessionId(response.data.session_id);
      setChatHistory([]);
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const generateResponse = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/process_query`, {
        query: query,
        session_id: currentSessionId,
      });

      const newMessage = { sender: 'Human', content: query };
      const botResponse = { sender: 'AI', content: response.data.response };

      setChatHistory((prev) => [...prev, newMessage, botResponse]);
      setQuery('');

      // Save chat history
      await axios.post(`${API_BASE_URL}/save_chat/${currentSessionId}`, [
        ...chatHistory,
        newMessage,
        botResponse,
      ]);

      // Update previous sessions
      setPreviousSessions((prev) => [
        { id: currentSessionId, messages: [...chatHistory, newMessage, botResponse] },
        ...prev.filter((session) => session.id !== currentSessionId),
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_chat_history/${sessionId}`);
      setChatHistory(response.data.chat_history);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Legal Assistant</h1>
      <div style={styles.chatContainer}>
        <div style={styles.chatHistory}>
          {chatHistory.map((msg, index) => (
            <div key={index} style={msg.sender === 'Human' ? styles.userMessage : styles.aiMessage}>
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your legal query"
            style={styles.input}
          />
          <button onClick={generateResponse} style={styles.button}>Generate Response</button>
          <button onClick={startNewChat} style={styles.button}>New Chat</button>
        </div>
      </div>
      <div style={styles.previousChats}>
        <h2>Previous Chats</h2>
        <ul>
          {previousSessions.map((session) => (
            <li key={session.id} onClick={() => loadChatHistory(session.id)} style={styles.sessionItem}>
              Session: {session.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  chatContainer: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px',
    marginBottom: '20px',
  },
  chatHistory: {
    height: '300px',
    overflowY: 'auto',
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px',
  },
  userMessage: {
    backgroundColor: '#e6f2ff',
    padding: '5px 10px',
    borderRadius: '5px',
    marginBottom: '5px',
  },
  aiMessage: {
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '5px',
    marginBottom: '5px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  previousChats: {
    marginTop: '20px',
  },
  sessionItem: {
    cursor: 'pointer',
    padding: '5px',
    margin: '5px 0',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
  },
};

export default Chatbot;