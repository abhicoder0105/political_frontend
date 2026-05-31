export default function MetricCard({ label, value, icon: Icon, tone = 'orange', helper }) {
  const tones = {
    orange: 'bg-orange-50 text-orange-700 ring-orange-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    slate: 'bg-slate-50 text-slate-700 ring-slate-100',
    red: 'bg-red-50 text-red-700 ring-red-100',
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value ?? 0}</p>
          {helper && <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>}
        </div>
        {Icon && (
          <div className={`rounded-lg p-3 ring-1 ${tones[tone] || tones.orange}`}>
            <Icon size={20} strokeWidth={2.4} />
          </div>
        )}
      </div>
    </div>
  )
}
