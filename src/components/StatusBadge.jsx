import { STATUS_COLORS } from '../constants'
import { humanizeEnum } from '../utils/enums'

export default function StatusBadge({ value }) {
  const color = STATUS_COLORS[value] || 'bg-slate-100 text-slate-700 ring-slate-200'
  return (
    <span className={`chip ring-1 ${color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {humanizeEnum(value)}
    </span>
  )
}
