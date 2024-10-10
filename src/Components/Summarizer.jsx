import { useEffect, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useFirebase } from '../Context/firebase';

export default function Summarizer() {
  const firebase = useFirebase();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const docs = await firebase.fetchingDocuments();
      setDocuments(Array.isArray(docs) ? docs : []);
      console.log(docs); // Log the fetched documents
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadDocuments = async () => {
    if (file) {
      setIsUploading(true);
      try {
        await firebase.uploadDocuments(file);
        console.log("File uploaded successfully!");
        await fetchDocuments();
        setFile(null);
      } catch (error) {
        console.error('Error uploading documents:', error);
      } finally {
        setIsUploading(false);
      }
    } else {
      console.log("No file selected.");
    }
  };

  const generateSummary = (docId) => {
    console.log(`Generating summary for document ID: ${docId}`);
    // Add logic to generate the summary
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Legal Document Summarizer</h1>
          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="document">
              Upload Legal Documents
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 flex flex-col items-center px-4 py-6 bg-blue-500 text-white rounded-lg shadow-md tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out">
                <Upload className="w-8 h-8" />
                <span className="mt-2 text-base leading-normal">Select files</span>
                <input type='file' className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>
              <button
                onClick={handleUploadDocuments}
                disabled={isUploading || !file}
                className={`px-6 py-2 rounded-lg font-bold ${
                  isUploading || !file
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                } transition duration-300 ease-in-out`}
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </div>

          {/* Display uploaded documents in table format */}
          <div className="overflow-x-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Uploaded Documents</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        {doc.fileName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date((doc.uploadedAt.seconds * 1000) + (doc.uploadedAt.nanoseconds / 1000000)).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => generateSummary(doc.id)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                      >
                        Generate Summary
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
