import { Link } from 'react-router-dom'
import { ArrowRight, HandHeart, Megaphone, Newspaper, ShieldCheck, Users, CheckCircle2, FileText } from 'lucide-react'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import Button from '../components/ui/Button'
import MetricCard from '../components/ui/MetricCard'

function updatePath(item) {
  if (item.type === 'pr_post') return `/news/${item.id}`
  if (item.type === 'campaign') return `/campaigns/${item.id}`
  if (item.type === 'work_done') return `/work/${item.id}`
  return '/'
}

export default function Home() {
  const { data, loading } = useApi('/api/public/home')
  const stats = data?.stats || {}
  const updates = data?.latest_updates || []
  const campaigns = data?.campaigns || []
  const posts = data?.pr_posts || []

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <LazyImage
          src="/images/politicians/rakesh_shukla/banners/hero-banner-1.svg"
          alt="राकेश शुक्ला"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          fallbackType="banner"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/45" />
        <div className="app-container relative grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-100 ring-1 ring-white/15">
              जनता की आवाज, सेवा का संकल्प
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              राकेश शुक्ला
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              मेहगांव क्षेत्र के विकास, जनसुनवाई, अभियान और नागरिक समस्याओं के समाधान के लिए आधुनिक डिजिटल मंच।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/request/new" size="lg">
                <FileText size={18} />
                अनुरोध दर्ज करें
              </Button>
              <Button as={Link} to="/campaigns" variant="secondary" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Megaphone size={18} />
                अभियान देखें
              </Button>
              <Button as={Link} to="/news" variant="ghost" size="lg" className="text-white hover:bg-white/10 hover:text-white">
                अपडेट देखें
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm font-black text-orange-100">त्वरित जनसेवा</p>
            <div className="mt-4 grid gap-3">
              {[
                ['मोबाइल OTP सत्यापन', 'सुरक्षित अनुरोध और समर्थन फॉर्म'],
                ['लाइव अभियान डेटा', 'Rails backend से वास्तविक अभियान/समाचार'],
                ['एडमिन ट्रैकिंग', 'अनुरोध स्थिति, असाइनमेंट और समाधान'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="flex items-center gap-2 font-black"><ShieldCheck size={16} /> {title}</p>
                  <p className="mt-1 text-sm text-slate-200">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="app-container -mt-10 relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="पूर्ण कार्य" value={stats.completed_work_count || 0} icon={CheckCircle2} tone="green" />
        <MetricCard label="सक्रिय अभियान" value={stats.active_campaign_count || 0} icon={Megaphone} tone="orange" />
        <MetricCard label="समाधान अनुरोध" value={stats.resolved_request_count || 0} icon={HandHeart} tone="blue" />
        <MetricCard label="समाचार" value={stats.published_pr_count || 0} icon={Newspaper} tone="slate" />
      </section>

      <section className="page-section app-container">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">लाइव अपडेट</p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">ताज़ा गतिविधियां</h2>
          </div>
          <Button as={Link} to="/news" variant="secondary">सभी समाचार</Button>
        </div>
        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="card h-72 animate-pulse bg-slate-100" />)}
          </div>
        ) : updates.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {updates.slice(0, 6).map((item) => (
              <Link key={`${item.type}-${item.id}`} to={updatePath(item)} className="group card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                <LazyImage src={item.image_url} alt={item.title} className="h-44 w-full object-cover" fallbackType="thumbnail" />
                <div className="p-5">
                  <span className="chip bg-orange-50 text-orange-700 ring-1 ring-orange-100">{item.type_label}</span>
                  <h3 className="mt-3 line-clamp-2 text-lg font-black text-slate-950 group-hover:text-orange-700">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="अभी कोई अपडेट नहीं" message="नई गतिविधियां प्रकाशित होते ही यहां दिखेंगी।" />
        )}
      </section>

      <section className="bg-white/70 py-12">
        <div className="app-container">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">अभियान</p>
              <h2 className="mt-1 text-3xl font-black text-slate-950">मुख्य अभियान</h2>
            </div>
            <Button as={Link} to="/campaigns" variant="secondary">सभी अभियान</Button>
          </div>
          {campaigns.length ? (
            <div className="grid gap-5 md:grid-cols-3">
              {campaigns.slice(0, 3).map((campaign) => (
                <Link key={campaign.id} to={`/campaigns/${campaign.id}`} className="group card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                  <LazyImage src={campaign.image_url} alt={campaign.title} className="h-48 w-full object-cover" fallbackType="campaign" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-slate-950 group-hover:text-orange-700">{campaign.title}</h3>
                      <StatusBadge value={campaign.campaign_status} />
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{campaign.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="कोई अभियान नहीं" message="सक्रिय अभियान उपलब्ध होते ही यहां दिखेंगे।" />
          )}
        </div>
      </section>

      <section className="page-section app-container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card-elevated p-6 sm:p-8">
            <p className="section-eyebrow">जनभागीदारी</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">समर्थन करें, जुड़ें और अपने क्षेत्र की बात पहुंचाएं</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              अभियान से जुड़ने, समर्थन देने या सार्वजनिक समस्या दर्ज करने के लिए सुरक्षित OTP आधारित फॉर्म का उपयोग करें।
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as={Link} to="/campaigns"><Users size={18} /> अभियान से जुड़ें</Button>
              <Button as={Link} to="/request/new" variant="secondary"><FileText size={18} /> शिकायत/अनुरोध</Button>
            </div>
          </div>
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="section-eyebrow">समाचार</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">हाल की खबरें</h2>
              </div>
              <Link to="/news" className="text-sm font-black text-orange-700 hover:underline">और देखें</Link>
            </div>
            <div className="grid gap-4">
              {posts.slice(0, 3).map((post) => (
                <Link key={post.id} to={`/news/${post.id}`} className="card group flex gap-4 overflow-hidden p-3 transition-all hover:border-orange-200 hover:shadow-md">
                  <LazyImage src={post.image_url} alt={post.title} className="h-24 w-28 shrink-0 rounded-lg object-cover" fallbackType="news" />
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-black text-slate-950 group-hover:text-orange-700">{post.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.content}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
