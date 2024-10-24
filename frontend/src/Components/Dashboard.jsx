import { Link } from 'react-router-dom';
import { FileText, Scale, PenTool, MessageSquare, User, LogOut } from 'lucide-react';
import { useFirebase } from '../Context/firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const firebase = useFirebase();
  const navigate=useNavigate();
  const [email, setEmail] = useState(null); // State to store the user's email



  const handleLogout = async () => {
    try {
      await firebase.SignOut(); // Call the sign-out function
      navigate('/'); // Redirect to the auth page after logging out
    } catch (error) {
      console.error('Logout error:', error); // Log any errors
    }
  };

  useEffect(() => {
    const user = firebase.getCurrentUser();
    if (user) {
      setEmail(user.email); // Set the user's email when available
    }
  }, [firebase]);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Scale className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">LegalEase</span>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/summarizer" className="flex items-center p-2 rounded hover:bg-gray-800">
                  <FileText className="h-5 w-5 mr-2" />
                  Summarizer
                </Link>
              </li>
              <li>
                <Link to="/drafter" className="flex items-center p-2 rounded hover:bg-gray-800">
                  <PenTool className="h-5 w-5 mr-2" />
                  Drafter
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="flex items-center p-2 rounded hover:bg-gray-800">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  ChatBot
                </Link>
              </li>
              <li>
                <Link to="/documentQ&A" className="flex items-center p-2 rounded hover:bg-gray-800">
                  <MessageSquare className="h-5 w-5 mr-2" />
                   Documnet Q&A
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2" />
            {/* Display user's email or a fallback message */}
            <span>{email || 'Loading...'}</span>
          </div>
          <button className="flex items-center text-sm text-gray-400 hover:text-white" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to LegalEase</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={<FileText className="h-8 w-8 text-blue-600" />}
            title="Legal Document Summarizer"
            description="Quickly extract key information from complex legal documents."
            link="/summarizer"
          />
          <DashboardCard
            icon={<PenTool className="h-8 w-8 text-blue-600" />}
            title="Legal Document Drafter"
            description="Generate professional legal documents with ease."
            link="/drafter"
          />
          <DashboardCard
            icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
            title="Legal Research ChatBot"
            description="Get instant answers to your legal research questions."
            link="/chatbot"
          />

            <DashboardCard
            icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
            title="Documnet Q&A"
            description="Understand your Documnets "
            link="/documentQ&A"
          />

        </div>
      </main>
    </div>
  );
}

function DashboardCard({ icon, title, description, link }) {
  return (
    <Link to={link} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold ml-2">{title}</h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <span className="text-blue-600 font-medium">Get started →</span>
    </Link>
  );
}
