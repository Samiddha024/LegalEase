import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Send, PlusCircle, MessageSquare } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000/chatbot' // Adjust this to your FastAPI server URL

const LegalAssistantChat = () => {
  const [query, setQuery] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [previousSessions, setPreviousSessions] = useState([])

  useEffect(() => {
    startNewChat()
  }, [])

  const startNewChat = async () => {
    try {
      const response = await axios.post("http://localhost:8000/chatbot/new_chat")
      setCurrentSessionId(response.data.session_id)
      setChatHistory([])
    } catch (error) {
      console.error('Error starting new chat:', error)
    }
  }

  const generateResponse = async () => {
    if (!query.trim()) return

    try {
      const response = await axios.post("http://localhost:8000/chatbot/process_query", {
        query: query,
        session_id: currentSessionId,
      })

      const newMessage = { sender: 'Human', content: query }
      const botResponse = { sender: 'AI', content: response.data.response }

      setChatHistory((prev) => [...prev, newMessage, botResponse])
      setQuery('')

      // Save chat history
      await axios.post("http://localhost:8000/chatbot/save_chat/${currentSessionId}", [
        ...chatHistory,
        newMessage,
        botResponse,
      ])

      // Update previous sessions
      setPreviousSessions((prev) => [
        { id: currentSessionId, messages: [...chatHistory, newMessage, botResponse] },
        ...prev.filter((session) => session.id !== currentSessionId),
      ])
    } catch (error) {
      console.error('Error generating response:', error)
    }
  }

  const loadChatHistory = async (sessionId) => {
    try {
      const response = await axios.get("http://localhost:8000/chatbot/get_chat_history/${sessionId}")
      setChatHistory(response.data.chat_history)
      setCurrentSessionId(sessionId)
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white p-4">
        <button
          onClick={startNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center mb-4"
        >
          <PlusCircle className="mr-2" size={20} />
          New Chat
        </button>
        <div className="overflow-y-auto h-full">
          <h2 className="text-xl font-semibold mb-2">Previous Chats</h2>
          {previousSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => loadChatHistory(session.id)}
              className="cursor-pointer p-2 hover:bg-indigo-700 rounded mb-1 flex items-center"
            >
              <MessageSquare className="mr-2" size={16} />
              <span className="truncate">Session: {session.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-indigo-900">Legal Assistant</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  msg.sender === 'Human' ? 'bg-indigo-100 ml-auto' : 'bg-white'
                } max-w-[80%]`}
              >
                <p className={`font-semibold ${msg.sender === 'Human' ? 'text-indigo-800' : 'text-gray-800'}`}>
                  {msg.sender}:
                </p>
                <p className="mt-1">{msg.content}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your legal query"
              className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && generateResponse()}
            />
            <button
              onClick={generateResponse}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md flex items-center justify-center"
            >
              <Send className="mr-2" size={20} />
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LegalAssistantChat