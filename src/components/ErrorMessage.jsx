import { AlertTriangle } from 'lucide-react'

export default function ErrorMessage({ message }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 text-red-600" size={18} />
        <div>
          <p className="text-sm font-black text-red-800">कुछ त्रुटि हुई</p>
          <p className="mt-1 text-sm font-semibold text-red-700">{message || 'कृपया थोड़ी देर बाद फिर प्रयास करें।'}</p>
        </div>
      </div>
    </div>
  )
}
