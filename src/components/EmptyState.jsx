export default function EmptyState({ message }) {
  return (
    <div className="py-12 text-center">
      <p className="text-base font-bold text-slate-400">{message || 'कुछ नहीं मिला'}</p>
    </div>
  )
}
