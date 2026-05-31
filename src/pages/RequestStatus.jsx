import { useState } from 'react'
import { apiRequest } from '../lib/api'
import StatusBadge from '../components/StatusBadge'
import { humanizeEnum } from '../utils/enums'
import { digitsOnly } from '../utils/forms'

export default function RequestStatus() {
  const [requestId, setRequestId] = useState('')
  const [phone, setPhone] = useState('')
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!requestId || phone.length !== 10) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await apiRequest(`/api/public_requests/${requestId}/track?phone_number=${encodeURIComponent(phone)}`)
      setRequest(res)
    } catch {
      setRequest(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">शिकायत की स्थिति जांचें</h1>
      <form onSubmit={handleSearch} className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto]">
        <input
          className="input"
          placeholder="शिकायत ID"
          value={requestId}
          onChange={(e) => setRequestId(digitsOnly(e.target.value))}
          inputMode="numeric"
          required
        />
        <input
          type="tel"
          className="input"
          placeholder="मोबाइल नंबर"
          value={phone}
          onChange={(e) => setPhone(digitsOnly(e.target.value, 10))}
          inputMode="numeric"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'खोज रहा है...' : 'खोजें'}
        </button>
      </form>

      {searched && !loading && !request && (
        <p className="mt-8 text-center text-slate-500">कोई शिकायत नहीं मिली</p>
      )}

      {request && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900">{request.request_title}</h3>
              <p className="mt-1 text-sm text-slate-500">{request.description}</p>
            </div>
            <StatusBadge value={request.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>श्रेणी: {humanizeEnum(request.category)}</span>
            <span>क्षेत्र: {request.area}</span>
            <span>दिनांक: {new Date(request.created_at).toLocaleDateString('hi-IN')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
