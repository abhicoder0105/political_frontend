import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardList, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import useApi from '../../hooks/useApi'
import { apiRequest } from '../../lib/api'
import { getStoredUser } from '../../lib/auth'
import SectionCard from '../../components/SectionCard'
import InfoRow from '../../components/InfoRow'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import ErrorMessage from '../../components/ErrorMessage'
import { TableSkeleton } from '../../components/Skeleton'
import EmptyState from '../../components/EmptyState'
import AssignRequestModal from '../../components/requests/AssignRequestModal'
import { SEVERITIES, REQUEST_STATUSES } from '../../constants'
import { humanizeEnum } from '../../utils/enums'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function AdminRequestDetail() {
  const { id } = useParams()
  const { data: req, loading, error, reload } = useApi(`/api/admin/requests/${id}`)
  const [assignOpen, setAssignOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(getStoredUser())
  }, [])

  const canAssign = currentUser && (
    currentUser.role === 'super_admin' ||
    currentUser.role === 'admin' ||
    currentUser.role === 'sub_admin' ||
    req?.assigned_to_user_id === currentUser.id
  )

  async function handleUpdate(endpoint, body, msg) {
    setSubmitting(true)
    try {
      await apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) })
      toast.success(msg)
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function formatDate(value) {
    return value ? new Date(value).toLocaleString('hi-IN') : '-'
  }

  if (loading) return <div className="p-4 sm:p-6"><TableSkeleton columns={2} /></div>
  if (error) return <div className="p-4 sm:p-6"><ErrorMessage message={error} /></div>
  if (!req) return <div className="p-4 sm:p-6"><ErrorMessage message="अनुरोध नहीं मिला" /></div>

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        eyebrow="अनुरोध विवरण"
        title={`अनुरोध #${req.id}`}
        description={req.request_title || 'जन अनुरोध का विस्तृत रिकॉर्ड'}
        actions={<Button as={Link} to="/admin/requests" variant="secondary"><ArrowLeft size={16} /> सूची पर वापस</Button>}
      />

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-700"><ClipboardList size={22} /></div>
            <div>
              <p className="font-black text-slate-950">{req.request_title || 'अनुरोध'}</p>
              <p className="text-sm text-slate-500">{req.area} • {req.village_or_ward}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={req.status} />
            <SeverityBadge value={req.severity} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="अनुरोध विवरण">
          <InfoRow label="शीर्षक" value={req.request_title} />
          <InfoRow label="श्रेणी" value={humanizeEnum(req.category)} />
          <InfoRow label="गंभीरता" value={<SeverityBadge value={req.severity} />} />
          <InfoRow label="स्थिति" value={<StatusBadge value={req.status} />} />
          <InfoRow label="विवरण" value={req.description} />
        </SectionCard>
        <SectionCard title="नागरिक जानकारी">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="rounded-full bg-slate-200 p-2 text-slate-700"><UserRound size={18} /></div>
            <div>
              <p className="font-black text-slate-900">{req.name}</p>
              <p className="text-sm text-slate-500">{req.phone_number}</p>
            </div>
          </div>
          <InfoRow label="क्षेत्र" value={req.area} />
          <InfoRow label="गांव / वार्ड" value={req.village_or_ward} />
        </SectionCard>
      </div>

      <SectionCard title="असाइनमेंट जानकारी">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="कार्यकर्ता" value={req.assigned_to_user ? `${req.assigned_to_user.name} (${humanizeEnum(req.assigned_to_user.role)})` : req.assigned_to || '-'} />
          <InfoRow label="असाइन किया" value={req.assigned_by_user?.name || '-'} />
          <InfoRow label="असाइन तिथि" value={formatDate(req.assigned_at)} />
          <InfoRow label="वर्तमान स्थिति" value={<StatusBadge value={req.status} />} />
        </div>
      </SectionCard>

      <SectionCard title="क्रियाएं">
        <div className="grid gap-4">
          {canAssign && (
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">असाइनमेंट</p>
              <Button disabled={submitting} onClick={() => setAssignOpen(true)}>असाइन करें</Button>
            </div>
          )}
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">स्थिति बदलें</p>
            <div className="flex flex-wrap gap-2">
              {REQUEST_STATUSES.map((status) => (
                <Button
                  key={status}
                  variant={req.status === status ? 'primary' : 'secondary'}
                  size="sm"
                  disabled={submitting || (!canAssign && req.assigned_to_user_id !== currentUser?.id)}
                  onClick={() => handleUpdate(`/api/admin/requests/${req.id}/status`, { status }, 'स्थिति अपडेट हुई')}
                >
                  {humanizeEnum(status)}
                </Button>
              ))}
            </div>
          </div>
          {canAssign && (
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">गंभीरता</p>
              <div className="flex flex-wrap gap-2">
                {SEVERITIES.map((severity) => (
                  <Button
                    key={severity}
                    variant={req.severity === severity ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={submitting}
                    onClick={() => handleUpdate(`/api/admin/requests/${req.id}/severity`, { severity }, 'गंभीरता अपडेट हुई')}
                  >
                    {humanizeEnum(severity)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="गतिविधि">
        {req.activities?.length ? (
          req.activities.map((activity) => (
            <div key={activity.id} className="border-b border-slate-100 py-3 text-sm last:border-b-0">
              <div className="font-black text-slate-900">{humanizeEnum(activity.action)}</div>
              <div className="text-slate-500">
                {humanizeEnum(activity.old_value) || '-'} → {humanizeEnum(activity.new_value) || '-'} | {formatDate(activity.created_at)}
              </div>
              {activity.notes && <div className="text-slate-600">{activity.notes}</div>}
            </div>
          ))
        ) : (
          <EmptyState title="कोई गतिविधि नहीं" message="इस अनुरोध पर अभी कोई गतिविधि दर्ज नहीं है।" />
        )}
      </SectionCard>

      {assignOpen && (
        <AssignRequestModal
          requestId={req.id}
          onClose={() => setAssignOpen(false)}
          onAssigned={() => { toast.success('अनुरोध असाइन हुआ'); reload() }}
        />
      )}
    </div>
  )
}
