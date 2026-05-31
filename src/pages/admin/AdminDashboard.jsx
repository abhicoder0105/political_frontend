import { Link } from 'react-router-dom'
import { CheckCircle2, FilePlus2, FileText, Megaphone, Newspaper, Plus, Users } from 'lucide-react'
import useApi from '../../hooks/useApi'
import { CardSkeleton } from '../../components/Skeleton'
import ErrorMessage from '../../components/ErrorMessage'
import PageHeader from '../../components/ui/PageHeader'
import MetricCard from '../../components/ui/MetricCard'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function AdminDashboard() {
  const { data, loading, error } = useApi('/api/analytics/summary')

  if (loading) return <div className="p-4 sm:p-6"><CardSkeleton count={6} /></div>
  if (error) return <div className="p-4 sm:p-6"><ErrorMessage message={error} /></div>

  const active = Number(data?.active_complaints || 0)
  const resolved = Number(data?.resolved_complaints || 0)
  const totalRequests = active + resolved
  const resolvedPercent = totalRequests ? Math.round((resolved / totalRequests) * 100) : 0

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        eyebrow="प्रशासन"
        title="डैशबोर्ड"
        description="अभियान, समर्थक, जनसंख्या रिकॉर्ड और नागरिक अनुरोधों का त्वरित अवलोकन।"
        actions={(
          <>
            <Button as={Link} to="/admin/campaigns" variant="secondary"><Plus size={16} /> अभियान</Button>
            <Button as={Link} to="/admin/pr"><FilePlus2 size={16} /> समाचार</Button>
          </>
        )}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="कुल जनसंख्या रिकॉर्ड" value={data?.total_population_count} icon={Users} tone="blue" />
        <MetricCard label="समर्थक" value={data?.supporter_count} icon={Users} tone="green" />
        <MetricCard label="सक्रिय अनुरोध" value={data?.active_complaints} icon={FileText} tone="orange" />
        <MetricCard label="समाधान अनुरोध" value={data?.resolved_complaints} icon={CheckCircle2} tone="green" />
        <MetricCard label="गंभीर अनुरोध" value={data?.critical_complaints} icon={FileText} tone="red" />
        <MetricCard label="गांवों की संख्या" value={data?.total_village_count} icon={Megaphone} tone="slate" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">अनुरोध समाधान प्रगति</h2>
              <p className="mt-1 text-sm text-slate-500">सक्रिय और समाधान हुए अनुरोधों के आधार पर।</p>
            </div>
            <span className="text-3xl font-black text-orange-700">{resolvedPercent}%</span>
          </div>
          <div className="mt-6 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-gradient-to-r from-orange-600 to-emerald-600" style={{ width: `${resolvedPercent}%` }} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-orange-50 p-4 text-orange-800">
              <p className="text-sm font-bold">सक्रिय</p>
              <p className="text-2xl font-black">{active}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
              <p className="text-sm font-bold">समाधान</p>
              <p className="text-2xl font-black">{resolved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-black text-slate-950">त्वरित क्रियाएं</h2>
          <div className="mt-4 grid gap-3">
            <Button as={Link} to="/admin/requests" variant="secondary" className="justify-start"><FileText size={16} /> अनुरोध देखें</Button>
            <Button as={Link} to="/admin/campaigns" variant="secondary" className="justify-start"><Megaphone size={16} /> अभियान प्रबंधन</Button>
            <Button as={Link} to="/admin/pr" variant="secondary" className="justify-start"><Newspaper size={16} /> समाचार अपडेट</Button>
            <Button as={Link} to="/admin/team" variant="secondary" className="justify-start"><Users size={16} /> टीम प्रबंधन</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
