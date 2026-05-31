import { Link } from 'react-router-dom'
import { MapPin, Megaphone } from 'lucide-react'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import { CardSkeleton } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'

export default function CampaignsList() {
  const { data, loading, error } = useApi('/api/public/campaigns')

  if (loading) return <div className="app-container py-14"><CardSkeleton count={6} /></div>
  if (error) return <div className="app-container py-14"><ErrorMessage message={error} /></div>

  const campaigns = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="app-container py-14">
      <PageHeader
        eyebrow="जनभागीदारी अभियान"
        title="अभियान"
        description="क्षेत्र में चल रहे अभियान, जनसंपर्क कार्यक्रम और सार्वजनिक गतिविधियां देखें।"
        actions={<Button as={Link} to="/request/new" variant="secondary">अनुरोध दर्ज करें</Button>}
      />

      {campaigns.length === 0 ? (
        <EmptyState title="कोई अभियान नहीं मिला" message="नया अभियान शुरू होते ही यहां दिखेगा।" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/campaigns/${campaign.id}`}
              className="group card overflow-hidden transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
            >
              <div className="relative">
                <LazyImage src={campaign.image_url} alt={campaign.title} className="h-52 w-full object-cover" fallbackType="campaign" />
                <div className="absolute left-4 top-4">
                  <StatusBadge value={campaign.campaign_status} />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-50 p-2 text-orange-700">
                    <Megaphone size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-lg font-black text-slate-950 group-hover:text-orange-700">{campaign.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{campaign.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {campaign.target_area && <span className="inline-flex items-center gap-1"><MapPin size={13} /> {campaign.target_area}</span>}
                  {campaign.target_village && <span>{campaign.target_village}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
