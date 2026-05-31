export function TableSkeleton({ columns = 5 }) {
  return (
    <div className="card animate-pulse p-4">
      <div className="hidden gap-4 border-b border-slate-100 pb-4 md:flex">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 flex-1 rounded bg-slate-200" />
        ))}
      </div>
      <div className="space-y-3 pt-4">
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} className="grid gap-3 rounded-lg border border-slate-100 p-3 md:grid-cols-5 md:border-0 md:p-0">
            {Array.from({ length: Math.min(columns, 5) }).map((_, col) => (
              <div key={col} className="h-4 rounded bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse overflow-hidden">
          <div className="h-40 bg-slate-200" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
