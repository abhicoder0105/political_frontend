export default function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-900">{title}</h3>
      {children}
    </div>
  )
}
