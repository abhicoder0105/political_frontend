import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'कुछ नहीं मिला', message, action }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="rounded-full bg-orange-50 p-4 text-orange-600 ring-1 ring-orange-100">
        <Inbox size={28} strokeWidth={2.2} />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {message || 'अभी दिखाने के लिए कोई डेटा उपलब्ध नहीं है।'}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
