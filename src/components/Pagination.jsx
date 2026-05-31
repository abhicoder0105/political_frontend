export default function Pagination({ meta, searchParams, setSearchParams }) {
  if (!meta || meta.total_pages <= 1) return null

  function goToPage(page) {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3 text-sm">
      <span className="font-medium text-slate-500">
        पृष्ठ {meta.current_page} / {meta.total_pages} | कुल {meta.total_count}
      </span>
      <div className="flex gap-2">
        <button
          disabled={meta.current_page <= 1}
          onClick={() => goToPage(meta.current_page - 1)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:bg-white disabled:hover:text-slate-600"
        >
          पिछला
        </button>
        <button
          disabled={meta.current_page >= meta.total_pages}
          onClick={() => goToPage(meta.current_page + 1)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:bg-white disabled:hover:text-slate-600"
        >
          अगला
        </button>
      </div>
    </div>
  )
}
