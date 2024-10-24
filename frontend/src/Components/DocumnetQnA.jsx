
import React, { useState } from 'react'
import axios from 'axios'
import { CheckCircle, FileText, Loader2 } from 'lucide-react'

export default function DocumnetQnA() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    }
  }

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value)
  }

  const handleSubmit = async () => {
    if (!selectedFile || !question) {
      alert("Please upload a PDF file and enter a question.")
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('question', question)

    try {
      setLoading(true)
      const response = await axios.post(`http://localhost:8000/doc-qna/ask_query`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setAnswer(response.data.answer)
    } catch (error) {
      console.error("Error fetching answer:", error)
      setAnswer("Error fetching answer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Legal Document Q&A with AI</h1>
        
        <div className="mb-6">
          <label htmlFor="file-upload" className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg border border-indigo-300 flex items-center justify-center transition duration-300">
            <FileText className="mr-2" />
            {selectedFile ? 'Change PDF' : 'Upload PDF'}
          </label>
          <input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </div>

        {uploadSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center" role="alert">
            <CheckCircle className="mr-2" />
            <span>PDF uploaded successfully!</span>
          </div>
        )}

        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={handleQuestionChange}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Generating Answer...
            </>
          ) : (
            'Get Answer'
          )}
        </button>

        {answer && (
          <div className="mt-8 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Answer:</h2>
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
