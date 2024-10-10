import { FileText } from 'lucide-react'

export default function GenerateSummary({ onGenerate }) {
  return (
    <button
      onClick={onGenerate}
      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
    >
      <FileText className="w-4 h-4 mr-2" />
      Generate Summary
    </button>
  )
}