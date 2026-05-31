import { SEVERITY_COLORS } from '../constants'
import { humanizeEnum } from '../utils/enums'

export default function SeverityBadge({ value }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${SEVERITY_COLORS[value] || 'bg-slate-100 text-slate-600'}`}>
      {humanizeEnum(value)}
    </span>
  )
}
