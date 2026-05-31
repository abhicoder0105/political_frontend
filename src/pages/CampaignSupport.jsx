import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { apiRequest } from '../lib/api'
import { toast } from 'sonner'

export default function CampaignSupport() {
  const { id } = useParams()
  const [form, setForm] = useState({ name: '', phone_number: '', support_type: 'supporter' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiRequest(`/api/public/campaigns/${id}/support`, {
        method: 'POST',
        body: JSON.stringify({ campaign_support: form }),
      })
      toast.success('समर्थन दर्ज किया गया')
      setDone(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="text-5xl">🙏</span>
        <h2 className="mt-4 text-2xl font-black text-slate-900">समर्थन के लिए धन्यवाद!</h2>
        <Link to="/campaigns" className="btn-primary mt-6 inline-block">
          वापस अभियान पर
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">अभियान को समर्थन करें</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label>
          <span className="label">आपका नाम</span>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          <span className="label">मोबाइल नंबर</span>
          <input type="tel" className="input" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} required />
        </label>
        <label>
          <span className="label">समर्थन प्रकार</span>
          <select className="input" value={form.support_type} onChange={(e) => setForm({ ...form, support_type: e.target.value })}>
            <option value="supporter">समर्थक</option>
            <option value="volunteer">स्वयंसेवक</option>
          </select>
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'दर्ज हो रहा...' : 'समर्थन करें'}
        </button>
      </form>
    </div>
  )
}
