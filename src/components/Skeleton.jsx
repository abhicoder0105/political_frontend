export function TableSkeleton({ columns }) {
  return (
    <div className="animate-pulse space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="mt-3 h-8 w-24 rounded bg-slate-200" />
          <div className="mt-1 h-4 w-32 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}
