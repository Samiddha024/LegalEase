// Header.jsx
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-indigo-900 text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Scale className="h-8 w-8 mr-2" />
          <span className="text-2xl font-bold">LegalEase</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-indigo-300">Home</Link></li>
            <li><Link to="/about" className="hover:text-indigo-300">About Us</Link></li>
            <li><Link to="/login" className="hover:text-indigo-300">Login</Link></li>
            <li><Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition duration-300">Sign Up</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
