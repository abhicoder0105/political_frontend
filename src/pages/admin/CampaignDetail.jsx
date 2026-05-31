import { useParams, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import LazyImage from '../../components/LazyImage'
import StatusBadge from '../../components/StatusBadge'
import { CardSkeleton } from '../../components/Skeleton'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdminCampaignDetail() {
  const { id } = useParams()
  const { data: campaign, loading, error } = useApi(`/api/campaigns/${id}`)

  if (loading) return <div className="p-5"><CardSkeleton count={1} /></div>
  if (error || !campaign) return <div className="p-5"><ErrorMessage message={error || 'अभियान नहीं मिला'} /></div>

  return (
    <div className="p-5">
      <Link to="/admin/campaigns" className="text-sm font-bold text-orange-600 hover:underline">
        ← अभियान पर वापस
      </Link>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-56">
          <LazyImage
            src={campaign.image_url}
            alt={campaign.title}
            className="h-full w-full object-cover"
            fallbackType="campaign"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <StatusBadge value={campaign.campaign_status} />
          </div>
        </div>
        <div className="space-y-4 p-6">
          <h2 className="text-2xl font-black text-slate-900">{campaign.title}</h2>
          {campaign.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{campaign.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            {campaign.target_area && <span>क्षेत्र: {campaign.target_area}</span>}
            {campaign.target_village && <span>गांव/वार्ड: {campaign.target_village}</span>}
          </div>
          {(campaign.scheduled_at || campaign.created_at) && (
            <p className="text-xs font-medium text-slate-400">
              {new Date(campaign.scheduled_at || campaign.created_at).toLocaleDateString('hi-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
