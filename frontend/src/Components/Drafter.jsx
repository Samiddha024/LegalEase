import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Edit, Download, AlertCircle } from 'lucide-react';

function Drafter() {
  const [caseDetails, setCaseDetails] = useState('');
  const [ipcSections, setIpcSections] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [editedDocument, setEditedDocument] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [message, setMessage] = useState('');

  const generateDocument = async () => {
    try {
      const response = await axios.post('http://localhost:8000/generate_document', {
        case_details: caseDetails,
        ipc_sections: ipcSections.split(',').map(item => item.trim()),
      });
      setGeneratedDocument(response.data.document_content);
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  const editDocument = async () => {
    try {
      const response = await axios.post('http://localhost:8000/edit_document', {
        document_content: generatedDocument,
      });
      setEditedDocument(response.data.document_content);
    } catch (error) {
      console.error('Error editing document:', error);
    }
  };

  const exportDocument = async () => {
    try {
      const response = await axios.post("http://localhost:8000/export_document?format=${exportFormat}", {
        document_content: editedDocument || generatedDocument,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error exporting document:', error);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-indigo-600 py-6 px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-white">Legal Document Generator</h1>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-semibold">Case Details:</span>
              <textarea
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter case details"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">IPC Sections (comma-separated):</span>
              <input
                type="text"
                value={ipcSections}
                onChange={(e) => setIpcSections(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="e.g. 302, 307, 498A"
              />
            </label>
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateDocument}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FileText className="mr-2 h-5 w-5" />
              Generate Document
            </button>
          </div>

          {generatedDocument && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Generated Document:</h2>
              <textarea
                value={generatedDocument}
                readOnly
                rows="10"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-50"
              />
              <div className="flex justify-center">
                <button
                  onClick={editDocument}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit className="mr-2 h-5 w-5" />
                  Edit Document
                </button>
              </div>
            </div>
          )}

          {editedDocument && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Edited Document:</h2>
              <textarea
                value={editedDocument}
                readOnly
                rows="10"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-50"
              />
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <label className="inline-flex items-center">
              <span className="mr-2 text-gray-700 font-semibold">Export Format:</span>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
            </label>
            <button
              onClick={exportDocument}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="mr-2 h-5 w-5" />
              Export Document
            </button>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-green-100 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">{message}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Drafter;