import { useParams, Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import ErrorMessage from '../components/ErrorMessage'

export default function NewsDetail() {
  const { id } = useParams()
  const { data: item, loading, error } = useApi(`/api/public/pr_posts/${id}`)

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="h-8 w-48 animate-pulse rounded bg-slate-200" /></div>
  if (error || !item) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorMessage message={error || 'समाचार नहीं मिला'} /></div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link to="/news" className="text-sm font-bold text-orange-600 hover:underline">← समाचार पर वापस</Link>
      <h1 className="mt-4 text-3xl font-black text-slate-900">{item.title}</h1>
      <p className="mt-2 text-sm text-slate-400">{new Date(item.published_at || item.created_at).toLocaleDateString('hi-IN')}</p>
      <LazyImage src={item.image_url} alt={item.title} className="mt-6 h-64 w-full rounded-xl object-cover" fallbackType="thumbnail" />
      <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-700">{item.content}</div>
    </div>
  )
}
