export default function InfoRow({ label, value }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-800">
        {value ?? '-'}
      </div>
    </div>
  )
}
