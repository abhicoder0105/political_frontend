import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Newspaper } from 'lucide-react'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import ErrorMessage from '../components/ErrorMessage'
import Button from '../components/ui/Button'

export default function NewsDetail() {
  const { id } = useParams()
  const { data: item, loading, error } = useApi(`/api/public/pr_posts/${id}`)

  if (loading) return <div className="app-container py-14"><div className="card h-96 animate-pulse bg-slate-100" /></div>
  if (error || !item) return <div className="app-container py-14"><ErrorMessage message={error || 'समाचार नहीं मिला'} /></div>

  return (
    <article className="app-container py-14">
      <Button as={Link} to="/news" variant="ghost" className="mb-6">
        <ArrowLeft size={17} />
        समाचार पर वापस
      </Button>
      <div className="mx-auto max-w-4xl">
        <span className="chip bg-blue-50 text-blue-700 ring-1 ring-blue-100"><Newspaper size={14} /> समाचार</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{item.title}</h1>
        <p className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500">
          <CalendarDays size={16} />
          {new Date(item.published_at || item.created_at).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <LazyImage src={item.image_url} alt={item.title} className="mt-8 h-[420px] w-full rounded-lg object-cover shadow-sm" fallbackType="news" loading="eager" />
        <div className="card mt-8 p-6 sm:p-8">
          <div className="whitespace-pre-line text-base leading-8 text-slate-700">{item.content}</div>
        </div>
      </div>
    </article>
  )
}
