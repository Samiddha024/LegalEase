import { useState } from 'react';
import { PenTool, Download } from 'lucide-react';

export default function Drafter() {
  const [documentType, setDocumentType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    address: '',
    state: '',
    years_of_residence: '',
    purpose: '',
    authority: '',
    issue_date: '',
  });
  const [generatedDocumentUrl, setGeneratedDocumentUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/generate_domicile_certificate?template_name=${documentType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setGeneratedDocumentUrl(`http://127.0.0.1:8000${result.pdf_url}`);
      } else {
        alert('Failed to generate document. ' + result.detail);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDownload = () => {
    window.open(generatedDocumentUrl, '_blank');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Legal Document Drafter</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Document Type
          <select onChange={(e) => setDocumentType(e.target.value)}>
            <option value="">Select a document type</option>
            <option value="domicile_certificate">Domicile Certificate</option>
            {/* Add more document types here */}
          </select>
        </label>

        <label>
          Name
          <input type="text" name="name" onChange={handleChange} />
        </label>

        <label>
          Father's Name
          <input type="text" name="father_name" onChange={handleChange} />
        </label>

        <label>
          Address
          <input type="text" name="address" onChange={handleChange} />
        </label>

        <label>
          State
          <input type="text" name="state" onChange={handleChange} />
        </label>

        <label>
          Years of Residence
          <input type="number" name="years_of_residence" onChange={handleChange} />
        </label>

        <label>
          Purpose
          <input type="text" name="purpose" onChange={handleChange} />
        </label>

        <label>
          Authority
          <input type="text" name="authority" onChange={handleChange} />
        </label>

        <label>
          Issue Date
          <input type="date" name="issue_date" onChange={handleChange} />
        </label>

        <button type="submit">Generate Document</button>
      </form>

      {generatedDocumentUrl && (
        <div>
          <h2>Generated Document</h2>
          <button onClick={handleDownload}>
            <Download /> Download Document
          </button>
        </div>
      )}
    </div>
  );
}
