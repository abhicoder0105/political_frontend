import useApi from '../../hooks/useApi'
import StatCard from '../../components/StatCard'
import { CardSkeleton } from '../../components/Skeleton'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdminDashboard() {
  const { data, loading, error } = useApi('/api/analytics/summary')

  if (loading) return (
    <div className="p-5">
      <h1 className="mb-5 text-xl font-black text-slate-900">डैशबोर्ड</h1>
      <CardSkeleton count={6} />
    </div>
  )
  if (error) return (
    <div className="p-5">
      <h1 className="mb-5 text-xl font-black text-slate-900">डैशबोर्ड</h1>
      <ErrorMessage message={error} />
    </div>
  )

  return (
    <div className="p-5">
      <h1 className="mb-5 text-xl font-black text-slate-900">डैशबोर्ड</h1>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="कुल जनसंख्या रिकॉर्ड" icon="👥" value={data?.total_population_count} />
        <StatCard label="समर्थक" icon="👍" value={data?.supporter_count} />
        <StatCard label="सक्रिय शिकायतें" icon="📋" value={data?.active_complaints} />
        <StatCard label="हल शिकायतें" icon="✅" value={data?.resolved_complaints} />
        <StatCard label="गंभीर शिकायतें" icon="🔴" value={data?.critical_complaints} />
        <StatCard label="गाँव की संख्या" icon="🏘️" value={data?.total_village_count} />
      </div>
    </div>
  )
}
