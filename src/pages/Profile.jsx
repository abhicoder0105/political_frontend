import useApi from '../hooks/useApi'
import LazyImage from '../components/LazyImage'
import ErrorMessage from '../components/ErrorMessage'

export default function Profile() {
  const { data: profile, loading, error } = useApi('/api/public/profile')

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-80 animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <ErrorMessage message={error || 'प्रोफाइल नहीं मिली'} />
      </div>
    )
  }

  const highlights = profile.highlights || profile.stats || []

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <LazyImage
            src={profile.profile_image_url || profile.image_url}
            alt={profile.name || 'राकेश शुक्ला'}
            className="h-96 w-full object-cover"
            fallbackType="profile"
            loading="eager"
          />
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">जनसेवा प्रोफाइल</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            {profile.name || 'राकेश शुक्ला'}
          </h1>
          {profile.designation && (
            <p className="mt-2 text-lg font-semibold text-slate-600">{profile.designation}</p>
          )}
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-700">
            {profile.bio || profile.about || 'क्षेत्र की समस्याओं, विकास कार्यों और जनसंपर्क के लिए समर्पित।'}
          </p>

          {highlights.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <div key={item.label || index} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm font-semibold text-orange-800">
            जनता से सीधे संवाद और समस्याओं के समाधान के लिए अनुरोध दर्ज करें।
          </div>
        </div>
      </div>
    </div>
  )
}
