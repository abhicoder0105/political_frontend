import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, HandHeart, MapPin, Users } from 'lucide-react'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import StatusBadge from '../components/StatusBadge'
import ErrorMessage from '../components/ErrorMessage'
import { CardSkeleton } from '../components/Skeleton'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function CampaignDetail() {
  const { id } = useParams()
  const { data: campaign, loading, error } = useApi(`/api/public/campaigns/${id}`)

  if (loading) return <div className="app-container py-14"><CardSkeleton count={1} /></div>
  if (error || !campaign) return <div className="app-container py-14"><ErrorMessage message={error || 'अभियान नहीं मिला'} /></div>

  return (
    <div className="pb-14">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <LazyImage src={campaign.image_url} alt={campaign.title} className="absolute inset-0 h-full w-full object-cover opacity-35" fallbackType="campaign" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
        <div className="app-container relative py-12 sm:py-20">
          <Button as={Link} to="/campaigns" variant="ghost" className="mb-8 text-white hover:bg-white/10 hover:text-white">
            <ArrowLeft size={17} />
            अभियान पर वापस
          </Button>
          <div className="max-w-3xl">
            <StatusBadge value={campaign.campaign_status} />
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{campaign.title}</h1>
            <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 text-slate-100">{campaign.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-slate-200">
              {campaign.target_area && <span className="inline-flex items-center gap-2"><MapPin size={16} /> {campaign.target_area}</span>}
              {campaign.target_village && <span>{campaign.target_village}</span>}
              {(campaign.scheduled_at || campaign.created_at) && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  {new Date(campaign.scheduled_at || campaign.created_at).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to={`/campaigns/${campaign.id}/support`} size="lg">
                <HandHeart size={18} />
                समर्थन करें
              </Button>
              <Button as={Link} to="/request/new" variant="secondary" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                जन अनुरोध दर्ज करें
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="app-container mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="p-6 sm:p-8">
          <p className="section-eyebrow">अभियान विवरण</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">मिशन और उद्देश्य</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
            {campaign.description || 'इस अभियान से जुड़ी जानकारी जल्द उपलब्ध होगी।'}
          </p>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-50 p-3 text-orange-700"><Users size={20} /></div>
              <div>
                <p className="font-black text-slate-950">जनभागीदारी</p>
                <p className="text-sm text-slate-600">अपना समर्थन दर्ज करें और अभियान टीम से जुड़ें।</p>
              </div>
            </div>
            <Button as={Link} to={`/campaigns/${campaign.id}/support`} className="mt-5 w-full">
              समर्थन फॉर्म खोलें
            </Button>
          </Card>
          <Card className="p-5">
            <p className="font-black text-slate-950">अभियान प्रगति</p>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-2 w-2/3 rounded-full bg-orange-600" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">स्थिति: {campaign.campaign_status ? 'डेटा backend से अपडेट होता है' : 'अपडेट प्रतीक्षित'}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
