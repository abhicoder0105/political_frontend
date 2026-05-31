import { useParams, Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import StatusBadge from '../components/StatusBadge'
import ErrorMessage from '../components/ErrorMessage'
import { humanizeEnum } from '../utils/enums'

export default function WorkDetail() {
  const { id } = useParams()
  const { data: work, loading, error } = useApi(`/api/public/work_dones/${id}`)

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="h-8 w-48 animate-pulse rounded bg-slate-200" /></div>
  if (error || !work) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorMessage message={error || 'कार्य नहीं मिला'} /></div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link to="/" className="text-sm font-bold text-orange-600 hover:underline">← होम पर वापस</Link>
      <h1 className="mt-4 text-2xl font-black text-slate-900">{work.title}</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <StatusBadge value={work.status} />
        <LazyImage src={work.image_url} alt={work.title} className="h-56 w-full rounded-lg object-cover" fallbackType="event" />
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{work.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {work.work_type && <span>प्रकार: {humanizeEnum(work.work_type)}</span>}
          {work.category && <span>श्रेणी: {humanizeEnum(work.category)}</span>}
          {work.area && <span>क्षेत्र: {work.area}</span>}
          {work.village && <span>गांव: {work.village}</span>}
          {work.budget && <span>बजट: ₹{work.budget}</span>}
        </div>
      </div>
    </div>
  )
}
