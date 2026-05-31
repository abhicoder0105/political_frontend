export default function FilterBar({ filters, query, onChange }) {
  return (
    <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4">
      {filters?.map((filter) => (
        <select
          key={filter.name}
          value={query[filter.name] || ''}
          onChange={(e) => onChange(filter.name, e.target.value)}
          className="input"
        >
          <option value="">{filter.label}</option>
          {filter.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}
