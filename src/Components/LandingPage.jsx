import { Link } from 'react-router-dom'; // Use react-router-dom for routing
import { ArrowRight, FileText, PenTool, MessageSquare, Scale, Users, BookOpen } from 'lucide-react';
import Footer from './Footer';
import Header from './Header';
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header></Header>

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white py-20">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <div className="w-1/2">
              <h1 className="text-5xl font-bold mb-4">Simplify Your Legal Work with LegalEase</h1>
              <p className="text-xl mb-8">Powerful AI-driven tools for legal professionals</p>
              <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full text-lg font-semibold inline-flex items-center transition duration-300">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="w-1/2">
              <img
                src="/placeholder.svg"
                alt="Legal professionals working"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <ServiceCard
                icon={<FileText className="h-12 w-12 text-indigo-600" />}
                title="Legal Document Summarizer"
                description="Quickly extract key information from complex legal documents."
              />
              <ServiceCard
                icon={<PenTool className="h-12 w-12 text-indigo-600" />}
                title="Legal Document Drafter"
                description="Generate professional legal documents with ease."
              />
              <ServiceCard
                icon={<MessageSquare className="h-12 w-12 text-indigo-600" />}
                title="Legal Research ChatBot"
                description="Get instant answers to your legal research questions."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-indigo-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">Why Choose LegalEase?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-200 p-3 rounded-full">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">Expert Team</h3>
                  <p className="text-gray-700">Our team consists of experienced legal professionals and AI experts.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-200 p-3 rounded-full">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">Comprehensive Database</h3>
                  <p className="text-gray-700">Access a vast library of legal resources and precedents.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-200 p-3 rounded-full">
                  <Scale className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">Accuracy and Reliability</h3>
                  <p className="text-gray-700">Our AI-powered tools ensure precise and dependable results.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-200 p-3 rounded-full">
                  <ArrowRight className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-900">Efficiency Boost</h3>
                  <p className="text-gray-700">Streamline your workflow and save valuable time on legal tasks.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-indigo-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
