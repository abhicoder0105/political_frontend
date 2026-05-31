import { useState } from 'react'
import { apiRequest } from '../lib/api'
import StatusBadge from '../components/StatusBadge'

export default function RequestStatus() {
  const [phone, setPhone] = useState('')
  const [requests, setRequests] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!phone) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await apiRequest(`/api/public/requests/status?phone=${encodeURIComponent(phone)}`)
      setRequests(Array.isArray(res) ? res : res?.data || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">शिकायत की स्थिति जाँचें</h1>
      <form onSubmit={handleSearch} className="mt-6 flex gap-3">
        <input
          type="tel"
          className="input flex-1"
          placeholder="मोबाइल नंबर दर्ज करें"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'खोज रहा...' : 'खोजें'}
        </button>
      </form>

      {searched && !loading && requests?.length === 0 && (
        <p className="mt-8 text-center text-slate-500">कोई शिकायत नहीं मिली</p>
      )}

      {requests?.length > 0 && (
        <div className="mt-8 space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{req.request_title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{req.description}</p>
                </div>
                <StatusBadge value={req.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                <span>श्रेणी: {req.category}</span>
                <span>क्षेत्र: {req.area}</span>
                <span>दिनांक: {new Date(req.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
