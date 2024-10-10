import { Link } from 'react-router-dom'
import { Facebook, Twitter, Mail, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LegalEase</h3>
            <p className="text-sm text-indigo-200">Simplifying legal work with AI-powered solutions.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-indigo-300 transition duration-300">Home</Link></li>
              <li><Link to="/about" className="text-sm hover:text-indigo-300 transition duration-300">About Us</Link></li>
              <li><Link to="/services" className="text-sm hover:text-indigo-300 transition duration-300">Services</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-indigo-300 transition duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm hover:text-indigo-300 transition duration-300">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-indigo-300 transition duration-300">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-indigo-300 hover:text-white transition duration-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition duration-300">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition duration-300">
                <Globe className="h-6 w-6" /> {/* Replaced LinkedIn with Globe */}
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition duration-300">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-indigo-800 text-center text-sm text-indigo-300">
          © {new Date().getFullYear()} LegalEase. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
