import useApi from '../hooks/useApi'
import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { CardSkeleton } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function NewsList() {
  const { data, loading, error } = useApi('/api/public/pr_posts')

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-16"><CardSkeleton count={3} /></div>
  if (error) return <div className="mx-auto max-w-5xl px-4 py-16"><ErrorMessage message={error} /></div>

  const news = Array.isArray(data) ? data : data?.data || []

  if (news.length === 0) return <div className="mx-auto max-w-5xl px-4 py-16"><EmptyState message="कोई समाचार नहीं" /></div>

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">समाचार</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {news.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.id}`}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <LazyImage src={item.image_url} alt={item.title} className="h-48 w-full object-cover" fallbackType="thumbnail" />
            <div className="p-4">
              <h3 className="font-bold text-slate-900 group-hover:text-orange-600">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.content}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(item.published_at || item.created_at).toLocaleDateString('hi-IN')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
