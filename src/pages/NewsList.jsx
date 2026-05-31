import { Link } from 'react-router-dom'
import { CalendarDays, Newspaper } from 'lucide-react'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import { CardSkeleton } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/ui/PageHeader'

export default function NewsList() {
  const { data, loading, error } = useApi('/api/public/pr_posts')

  if (loading) return <div className="app-container py-14"><CardSkeleton count={6} /></div>
  if (error) return <div className="app-container py-14"><ErrorMessage message={error} /></div>

  const news = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="app-container py-14">
      <PageHeader
        eyebrow="समाचार और अपडेट"
        title="ताज़ा समाचार"
        description="प्रचार, जनसंपर्क, अभियान और विकास कार्यों से जुड़ी नवीनतम जानकारी।"
      />

      {news.length === 0 ? (
        <EmptyState title="कोई समाचार नहीं" message="नई अपडेट प्रकाशित होते ही यहां दिखाई जाएगी।" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {news.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group card overflow-hidden transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
            >
              <LazyImage src={item.image_url} alt={item.title} className="h-48 w-full object-cover" fallbackType="news" />
              <div className="p-5">
                <span className="chip bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <Newspaper size={13} />
                  समाचार
                </span>
                <h3 className="mt-3 line-clamp-2 text-lg font-black text-slate-950 group-hover:text-orange-700">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.content}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <CalendarDays size={14} />
                  {new Date(item.published_at || item.created_at).toLocaleDateString('hi-IN')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
