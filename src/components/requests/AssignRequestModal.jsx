import { useEffect, useState } from 'react'
import { CheckCircle2, Search, UserRound, X } from 'lucide-react'
import { apiRequest } from '../../lib/api'
import { humanizeEnum } from '../../utils/enums'
import Button from '../ui/Button'

const avatarColors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500']

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((word) => word[0]).join('').toUpperCase().slice(0, 2)
}

function getColor(id) {
  return avatarColors[(id || 0) % avatarColors.length]
}

export default function AssignRequestModal({ requestId, onClose, onAssigned }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function loadUsers(term) {
    setLoading(true)
    setError('')
    try {
      const q = term ? `?search=${encodeURIComponent(term)}` : ''
      const data = await apiRequest(`/api/admin/assignable_users${q}`)
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'उपयोगकर्ता लोड करने में त्रुटि')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadUsers(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  async function handleAssign() {
    if (!selectedId) return
    setSubmitting(true)
    setError('')
    try {
      await apiRequest(`/api/admin/requests/${requestId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ assigned_to_id: selectedId }),
      })
      onAssigned()
      onClose()
    } catch (err) {
      setError(err.message || 'असाइन करने में त्रुटि')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="section-eyebrow">Assignment</p>
            <h2 className="text-xl font-black text-slate-950">अनुरोध असाइन करें</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="बंद करें">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input className="input pl-10" placeholder="नाम या मोबाइल से खोजें..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
          </div>

          {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {loading && [1, 2, 3].map((item) => (
              <div key={item} className="flex animate-pulse items-center gap-3 rounded-lg border border-slate-100 p-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
            ))}

            {!loading && users.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 py-8 text-center">
                <UserRound className="mx-auto text-slate-400" size={28} />
                <p className="mt-2 text-sm font-black text-slate-500">कोई उपयोगकर्ता नहीं मिला</p>
              </div>
            )}

            {!loading && users.map((user) => {
              const selected = selectedId === user.id
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedId(user.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    selected ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-100' : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white ${getColor(user.id)}`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-black text-slate-900">{user.name}</div>
                      <div className="truncate text-xs font-semibold text-slate-500">
                        {humanizeEnum(user.role_name || user.role)}
                        {user.mobile_number ? ` • ${user.mobile_number}` : ''}
                      </div>
                    </div>
                    {selected && <CheckCircle2 className="text-orange-600" size={20} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <Button onClick={onClose} variant="secondary">रद्द करें</Button>
          <Button disabled={!selectedId || submitting} onClick={handleAssign}>{submitting ? 'असाइन हो रहा है...' : 'असाइन करें'}</Button>
        </div>
      </div>
    </div>
  )
}
