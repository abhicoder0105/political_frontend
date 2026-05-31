export default function SeverityBadge({ value }) {
  const colors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${colors[value] || 'bg-slate-100 text-slate-600'}`}>
      {value}
    </span>
  )
}
