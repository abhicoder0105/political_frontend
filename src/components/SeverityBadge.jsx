import { SEVERITY_COLORS } from '../constants'
import { humanizeEnum } from '../utils/enums'

export default function SeverityBadge({ value }) {
  return (
    <span className={`chip ring-1 ${SEVERITY_COLORS[value] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
      {humanizeEnum(value)}
    </span>
  )
}
