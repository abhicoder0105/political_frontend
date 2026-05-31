import { useState, useEffect } from 'react'
import { apiRequest } from '../../lib/api'
import { humanizeEnum } from '../../utils/enums'

const avatarColors = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-teal-500',
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
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

  useEffect(() => {
    loadUsers('')
  }, [])

  async function loadUsers(term) {
    setLoading(true)
    setError('')
    try {
      const q = term ? `?search=${encodeURIComponent(term)}` : ''
      const data = await apiRequest(`/api/admin/assignable_users${q}`)
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'उपयोगकर्ता लोड करने में विफल')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(value) {
    setSearch(value)
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
      setError(err.message || 'असाइन करने में विफल')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-xl font-black text-slate-900">शिकायत असाइन करें</h2>
        </div>

        <div className="p-5">
          <div className="relative mb-4">
            <input
              className="input w-full pl-10"
              placeholder="नाम या मोबाइल से खोजें..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="max-h-80 space-y-1 overflow-y-auto">
            {loading && (
              <div className="space-y-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex animate-pulse items-center gap-3 rounded-lg p-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && users.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-base font-bold text-slate-400">कोई उपयोगकर्ता नहीं मिला</p>
              </div>
            )}

            {!loading && users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedId(user.id)}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  selectedId === user.id
                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${getColor(user.id)}`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{humanizeEnum(user.role_name)} {user.mobile_number ? `• ${user.mobile_number}` : ''}</div>
                  </div>
                  {selectedId === user.id && (
                    <span className="text-lg text-orange-600">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
          >
            रद्द करें
          </button>
          <button
            disabled={!selectedId || submitting}
            onClick={handleAssign}
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50"
          >
            {submitting ? 'असाइन हो रहा है...' : 'शिकायत असाइन करें'}
          </button>
        </div>
      </div>
    </div>
  )
}
