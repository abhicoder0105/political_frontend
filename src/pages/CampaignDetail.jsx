import { useParams, Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import StatusBadge from '../components/StatusBadge'
import ErrorMessage from '../components/ErrorMessage'
import { CardSkeleton } from '../components/Skeleton'

export default function CampaignDetail() {
  const { id } = useParams()
  const { data: campaign, loading, error } = useApi(`/api/public/campaigns/${id}`)

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16"><CardSkeleton count={1} /></div>
  if (error || !campaign) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorMessage message={error || 'अभियान नहीं मिला'} /></div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link to="/campaigns" className="text-sm font-bold text-orange-600 hover:underline">← वापस अभियान पर</Link>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {campaign.image_url && (
          <div className="relative h-56">
            <LazyImage src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" fallbackType="thumbnail" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <StatusBadge value={campaign.campaign_status} />
            </div>
          </div>
        )}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-black text-slate-900">{campaign.title}</h2>
          {campaign.description && (
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{campaign.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            {campaign.target_area && <span>📍 {campaign.target_area}</span>}
            {campaign.target_village && <span>🏘️ {campaign.target_village}</span>}
          </div>
          <p className="text-xs font-medium text-slate-400">
            {new Date(campaign.scheduled_at || campaign.created_at).toLocaleDateString('hi-IN', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
          <Link to={`/campaigns/${campaign.id}/support`} className="btn-primary inline-block">
            समर्थन करें
          </Link>
        </div>
      </div>
    </div>
  )
}
