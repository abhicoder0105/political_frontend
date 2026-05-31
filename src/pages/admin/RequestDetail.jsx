import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { apiRequest } from '../../lib/api'
import { getStoredUser } from '../../lib/auth'
import { toast } from 'sonner'
import SectionCard from '../../components/SectionCard'
import InfoRow from '../../components/InfoRow'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import ErrorMessage from '../../components/ErrorMessage'
import { TableSkeleton } from '../../components/Skeleton'
import EmptyState from '../../components/EmptyState'
import AssignRequestModal from '../../components/requests/AssignRequestModal'
import { SEVERITIES, REQUEST_STATUSES } from '../../constants'

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
    req?.assigned_to_user_id === currentUser.id ||
    currentUser.role === 'sub_admin'
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

  function formatDate(d) {
    return d ? new Date(d).toLocaleString() : '-'
  }

  if (loading) return (
    <div className="p-5">
      <TableSkeleton columns={2} />
    </div>
  )
  if (error) return <div className="p-5"><ErrorMessage message={error} /></div>
  if (!req) return <div className="p-5"><ErrorMessage message="शिकायत नहीं मिली" /></div>

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-xl font-black text-slate-900">शिकायत #{req.id}</h1>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="शिकायत विवरण">
          <InfoRow label="शिकायत शीर्षक" value={req.request_title} />
          <InfoRow label="श्रेणी" value={req.category} />
          <InfoRow label="गंभीरता" value={<SeverityBadge value={req.severity} />} />
          <InfoRow label="स्थिति" value={<StatusBadge value={req.status} />} />
          <InfoRow label="विवरण" value={req.description} />
        </SectionCard>
        <SectionCard title="नागरिक जानकारी">
          <InfoRow label="नाम" value={req.name} />
          <InfoRow label="मोबाइल" value={req.phone_number} />
          <InfoRow label="क्षेत्र" value={req.area} />
          <InfoRow label="गाँव / वार्ड" value={req.village_or_ward} />
        </SectionCard>
      </div>

      <SectionCard title="असाइनमेंट जानकारी">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="कार्यकर्ता" value={req.assigned_to_user ? `${req.assigned_to_user.name} (${req.assigned_to_user.role})` : req.assigned_to || '-'} />
          <InfoRow label="असाइन किया" value={req.assigned_by_user?.name || '-'} />
          <InfoRow label="असाइन तिथि" value={formatDate(req.assigned_at)} />
          <InfoRow label="वर्तमान स्थिति" value={<StatusBadge value={req.status} />} />
        </div>
      </SectionCard>

      <SectionCard title="क्रियाएँ">
        <div className="flex flex-wrap gap-2">
          {canAssign && (
            <div className="flex flex-wrap gap-2 rounded-lg bg-slate-50 p-3">
              <button
                disabled={submitting}
                onClick={() => setAssignOpen(true)}
                className="rounded-lg border-2 border-orange-600 bg-white px-4 py-2 text-sm font-bold text-orange-600 transition-all hover:bg-orange-600 hover:text-white disabled:opacity-50"
              >
                असाइन करें
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 rounded-lg bg-slate-50 p-3">
            <span className="mr-1 self-center text-xs font-black uppercase text-slate-500">स्थिति</span>
            {REQUEST_STATUSES.map((s) => (
              <button
                key={s}
                disabled={submitting || (!canAssign && req.assigned_to_user_id !== currentUser?.id)}
                onClick={() => handleUpdate(`/api/admin/requests/${req.id}/status`, { status: s }, 'स्थिति अपडेट की गई')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          {canAssign && (
            <div className="flex flex-wrap gap-2 rounded-lg bg-slate-50 p-3">
              <span className="mr-1 self-center text-xs font-black uppercase text-slate-500">गंभीरता</span>
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  disabled={submitting}
                  onClick={() => handleUpdate(`/api/admin/requests/${req.id}/severity`, { severity: s }, 'गंभीरता अपडेट की गई')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="गतिविधि">
        {req.activities?.length ? (
          req.activities.map((a) => (
            <div key={a.id} className="border-b border-slate-100 py-3 text-sm">
              <div className="font-black">{a.action}</div>
              <div className="text-slate-500">
                {a.old_value || '-'} → {a.new_value || '-'} | {new Date(a.created_at).toLocaleString()}
              </div>
              {a.notes && <div className="text-slate-600">{a.notes}</div>}
            </div>
          ))
        ) : (
          <EmptyState message="कोई गतिविधि नहीं" />
        )}
      </SectionCard>

      {assignOpen && (
        <AssignRequestModal
          requestId={req.id}
          onClose={() => setAssignOpen(false)}
          onAssigned={() => { toast.success('Request assigned successfully'); reload() }}
        />
      )}
    </div>
  )
}
