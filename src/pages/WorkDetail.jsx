import { useParams, Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import StatusBadge from '../components/StatusBadge'
import ErrorMessage from '../components/ErrorMessage'

export default function WorkDetail() {
  const { id } = useParams()
  const { data: work, loading, error } = useApi(`/api/public/work_dones/${id}`)

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="h-8 w-48 animate-pulse rounded bg-slate-200" /></div>
  if (error || !work) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorMessage message={error || 'कार्य नहीं मिला'} /></div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">{work.title}</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <StatusBadge value={work.status} />
        {work.image_url && (
          <LazyImage src={work.image_url} alt={work.title} className="h-56 w-full rounded-lg object-cover" />
        )}
        <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{work.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span>प्रकार: {work.work_type}</span>
          <span>श्रेणी: {work.category}</span>
          <span>क्षेत्र: {work.area}</span>
          <span>गाँव: {work.village}</span>
          {work.budget && <span>बजट: ₹{work.budget}</span>}
        </div>
      </div>
      <Link to="/" className="mt-4 inline-block text-sm font-bold text-orange-600 hover:underline">← होम पर वापस</Link>
    </div>
  )
}
