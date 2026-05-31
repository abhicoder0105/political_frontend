import useApi from '../../hooks/useApi'
import StatCard from '../../components/StatCard'
import { CardSkeleton } from '../../components/Skeleton'
import ErrorMessage from '../../components/ErrorMessage'

export default function Reports() {
  const { data, loading, error } = useApi('/api/analytics/summary')

  return (
    <div className="p-5">
      <h1 className="mb-5 text-xl font-black text-slate-900">रिपोर्ट / एनालिटिक्स</h1>
      {loading && <CardSkeleton count={6} />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <StatCard label="कुल जनसंख्या" value={data?.total_population_count} />
          <StatCard label="समर्थक" value={data?.supporter_count} />
          <StatCard label="सक्रिय अनुरोध" value={data?.active_complaints} />
          <StatCard label="हल अनुरोध" value={data?.resolved_complaints} />
          <StatCard label="गंभीर अनुरोध" value={data?.critical_complaints} />
          <StatCard label="गांवों की संख्या" value={data?.total_village_count} />
        </div>
      )}
    </div>
  )
}
