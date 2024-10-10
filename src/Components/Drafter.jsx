import { useState } from 'react'
import { PenTool, Download } from 'lucide-react'

export default function Drafter() {
  const [documentType, setDocumentType] = useState('')
  const [details, setDetails] = useState('')
  const [generatedDocument, setGeneratedDocument] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate document generation based on user input
    setGeneratedDocument(
      `This is a generated ${documentType} based on the provided details: "${details}". It includes all necessary clauses and follows standard legal formatting.`
    )
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const fileBlob = new Blob([generatedDocument], { type: 'text/plain' })
    element.href = URL.createObjectURL(fileBlob)
    element.download = `${documentType}-document.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Legal Document Drafter</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentType">
              Document Type
            </label>
            <select
              id="documentType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="">Select a document type</option>
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="will">Will</option>
              <option value="powerOfAttorney">Power of Attorney</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
              Document Details
            </label>
            <textarea
              id="details"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter the specific details for your legal document..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Generate Document
          </button>
        </form>
        {generatedDocument && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Generated Document</h2>
            <p className="text-gray-700 mb-4">{generatedDocument}</p>
            <button
              onClick={handleDownload}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Document
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
