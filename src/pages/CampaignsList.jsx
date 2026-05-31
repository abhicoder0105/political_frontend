import useApi from '../hooks/useApi'
import { Link } from 'react-router-dom'
import LazyImage from '../components/LazyImage'
import { CardSkeleton } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'

export default function CampaignsList() {
  const { data, loading, error } = useApi('/api/public/campaigns')

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16"><CardSkeleton count={3} /></div>
  if (error) return <div className="mx-auto max-w-4xl px-4 py-16"><ErrorMessage message={error} /></div>

  const campaigns = Array.isArray(data) ? data : data?.data || []

  if (campaigns.length === 0) return <div className="mx-auto max-w-4xl px-4 py-16"><EmptyState message="कोई अभियान नहीं" /></div>

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">अभियान</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            to={`/campaigns/${c.id}`}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            {c.image_url && (
              <LazyImage src={c.image_url} alt={c.title} className="h-48 w-full object-cover" fallbackType="thumbnail" />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600">{c.title}</h3>
                <StatusBadge value={c.campaign_status} />
              </div>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                {c.target_area && <span>📍 {c.target_area}</span>}
                {c.target_village && <span>🏘️ {c.target_village}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
