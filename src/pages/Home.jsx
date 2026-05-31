import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-black md:text-6xl">
            राकेश शुक्ला CRM
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            जनता की आवाज, सेवा का संकल्प — एकीकृत जनसंपर्क एवं शिकायत प्रबंधन प्रणाली
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/request/new"
              className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold transition-all hover:bg-orange-700"
            >
              नई शिकायत दर्ज करें
            </Link>
            <Link
              to="/request/status"
              className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur transition-all hover:bg-white/20"
            >
              शिकायत की स्थिति जाँचें
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="text-4xl">📋</span>
            <h3 className="mt-3 text-lg font-bold text-slate-900">शिकायत दर्ज करें</h3>
            <p className="mt-2 text-sm text-slate-500">
              अपनी समस्या दर्ज करें और स्थिति की जाँच करें
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="text-4xl">📰</span>
            <h3 className="mt-3 text-lg font-bold text-slate-900">समाचार</h3>
            <p className="mt-2 text-sm text-slate-500">
              नवीनतम गतिविधियों और विकास कार्यों की जानकारी
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="text-4xl">🎯</span>
            <h3 className="mt-3 text-lg font-bold text-slate-900">अभियान</h3>
            <p className="mt-2 text-sm text-slate-500">
              चल रहे अभियानों में भाग लें और समर्थन करें
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
