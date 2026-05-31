import { Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import StatusBadge from '../components/StatusBadge'

function updatePath(item) {
  if (item.type === 'pr_post') return `/news/${item.id}`
  if (item.type === 'campaign') return `/campaigns/${item.id}`
  if (item.type === 'work_done') return `/work/${item.id}`
  return '/'
}

export default function Home() {
  const { data } = useApi('/api/public/home')
  const stats = data?.stats || {}
  const updates = data?.latest_updates || []
  const campaigns = data?.campaigns || []
  const posts = data?.pr_posts || []

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <LazyImage
          src="/images/politicians/rakesh_shukla/banners/hero-banner-1.svg"
          alt="राकेश शुक्ला"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          fallbackType="banner"
          loading="eager"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <h1 className="max-w-3xl text-4xl font-black md:text-6xl">राकेश शुक्ला</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-100">
            जनता की आवाज, सेवा का संकल्प और मेहगांव क्षेत्र के विकास के लिए डिजिटल जनसंपर्क मंच।
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/request/new" className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold transition-all hover:bg-orange-700">
              नया अनुरोध दर्ज करें
            </Link>
            <Link to="/campaigns" className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur transition-all hover:bg-white/20">
              अभियान देखें
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-black text-slate-900">{stats.completed_work_count || 0}</p>
          <p className="text-sm font-semibold text-slate-500">पूर्ण कार्य</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-black text-slate-900">{stats.active_campaign_count || 0}</p>
          <p className="text-sm font-semibold text-slate-500">सक्रिय अभियान</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-black text-slate-900">{stats.resolved_request_count || 0}</p>
          <p className="text-sm font-semibold text-slate-500">समाधान अनुरोध</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-black text-slate-900">{stats.published_pr_count || 0}</p>
          <p className="text-sm font-semibold text-slate-500">समाचार</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-900">ताज़ा अपडेट</h2>
          <Link to="/news" className="text-sm font-bold text-orange-600">सभी समाचार</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {updates.slice(0, 6).map((item) => (
            <Link key={`${item.type}-${item.id}`} to={updatePath(item)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <LazyImage src={item.image_url} alt={item.title} className="h-40 w-full object-cover" fallbackType="thumbnail" />
              <div className="p-4">
                <span className="text-xs font-black text-orange-600">{item.type_label}</span>
                <h3 className="mt-1 font-bold text-slate-900 group-hover:text-orange-600">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-2xl font-black text-slate-900">मुख्य अभियान</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {campaigns.slice(0, 3).map((campaign) => (
            <Link key={campaign.id} to={`/campaigns/${campaign.id}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <LazyImage src={campaign.image_url} alt={campaign.title} className="h-40 w-full object-cover" fallbackType="thumbnail" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 group-hover:text-orange-600">{campaign.title}</h3>
                  <StatusBadge value={campaign.campaign_status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{campaign.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 pb-16">
        <h2 className="text-2xl font-black text-slate-900">समाचार</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.id} to={`/news/${post.id}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <LazyImage src={post.image_url} alt={post.title} className="h-40 w-full object-cover" fallbackType="thumbnail" />
              <div className="p-4">
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{post.content}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
