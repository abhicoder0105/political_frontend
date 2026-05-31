export default function StatCard({ label, value, icon }) {
  return (
    <div className="card p-5">
      {icon && <div className="text-2xl">{icon}</div>}
      <p className="mt-3 text-3xl font-black text-slate-950">{value ?? '-'}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
    </div>
  )
}
