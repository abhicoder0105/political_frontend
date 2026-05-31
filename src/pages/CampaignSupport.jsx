import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import OtpBox from '../components/OtpBox'
import { digitsOnly, nameOnly } from '../utils/forms'

export default function CampaignSupport() {
  const { id } = useParams()
  const [form, setForm] = useState({ campaign_id: id, name: '', phone_number: '', area: '', village_or_ward: '', message: '' })
  const [verifiedPhone, setVerifiedPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function update(field, value) {
    const next =
      field === 'phone_number' ? digitsOnly(value, 10) :
      field === 'name' ? nameOnly(value) :
      value
    setForm((current) => ({ ...current, [field]: next }))
    if (field === 'phone_number') setVerifiedPhone('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('नाम आवश्यक है')
    if (form.phone_number.length !== 10) return toast.error('मोबाइल नंबर 10 अंकों का होना चाहिए')
    if (verifiedPhone !== form.phone_number) return toast.error('कृपया OTP सत्यापित करें')

    setSubmitting(true)
    try {
      await apiRequest('/api/public/campaign_supports', {
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
          अभियान पर वापस
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">अभियान को समर्थन करें</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label>
          <span className="label">आपका नाम</span>
          <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </label>
        <label>
          <span className="label">मोबाइल नंबर</span>
          <input type="tel" className="input" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} inputMode="numeric" required />
        </label>
        <OtpBox phoneNumber={form.phone_number} purpose="campaign_support" onVerified={() => setVerifiedPhone(form.phone_number)} />
        <label>
          <span className="label">क्षेत्र</span>
          <input className="input" value={form.area} onChange={(e) => update('area', e.target.value)} />
        </label>
        <label>
          <span className="label">गांव / वार्ड</span>
          <input className="input" value={form.village_or_ward} onChange={(e) => update('village_or_ward', e.target.value)} />
        </label>
        <label>
          <span className="label">संदेश</span>
          <textarea className="input min-h-24" value={form.message} onChange={(e) => update('message', e.target.value)} />
        </label>
        <button type="submit" disabled={submitting || verifiedPhone !== form.phone_number} className="btn-primary w-full">
          {submitting ? 'दर्ज हो रहा है...' : 'समर्थन करें'}
        </button>
      </form>
    </div>
  )
}
