export default function SectionCard({ title, children }) {
  return (
    <section className="card p-5">
      <h3 className="mb-4 text-base font-black text-slate-950">{title}</h3>
      {children}
    </section>
  )
}
