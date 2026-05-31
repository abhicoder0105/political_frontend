import { useState } from 'react'
import { apiRequest } from '../lib/api'
import { toast } from 'sonner'

export default function NewRequest() {
  const [form, setForm] = useState({
    request_title: '',
    name: '',
    phone_number: '',
    area: '',
    village_or_ward: '',
    category: '',
    severity: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiRequest('/api/public/requests', {
        method: 'POST',
        body: JSON.stringify({ public_request: form }),
      })
      toast.success('शिकायत सफलतापूर्वक दर्ज की गई')
      setSubmitted(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="text-5xl">✅</span>
        <h2 className="mt-4 text-2xl font-black text-slate-900">शिकायत दर्ज हो गई</h2>
        <p className="mt-2 text-slate-500">आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। जल्द ही समाधान किया जाएगा।</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary mt-6">
          नई शिकायत दर्ज करें
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">नई शिकायत दर्ज करें</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label>
          <span className="label">शिकायत का शीर्षक</span>
          <input className="input" value={form.request_title} onChange={(e) => setForm({ ...form, request_title: e.target.value })} required />
        </label>
        <label>
          <span className="label">आपका नाम</span>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          <span className="label">मोबाइल नंबर</span>
          <input type="tel" className="input" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} required />
        </label>
        <label>
          <span className="label">क्षेत्र</span>
          <input className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        </label>
        <label>
          <span className="label">गाँव / वार्ड</span>
          <input className="input" value={form.village_or_ward} onChange={(e) => setForm({ ...form, village_or_ward: e.target.value })} />
        </label>
        <label>
          <span className="label">श्रेणी</span>
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">चुनें</option>
            <option value="water">पानी</option>
            <option value="road">सड़क</option>
            <option value="electricity">बिजली</option>
            <option value="sanitation">स्वच्छता</option>
            <option value="health">स्वास्थ्य</option>
            <option value="education">शिक्षा</option>
            <option value="land">जमीन</option>
            <option value="pension">पेंशन</option>
            <option value="ration">राशन</option>
            <option value="other">अन्य</option>
          </select>
        </label>
        <label>
          <span className="label">गंभीरता</span>
          <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
            <option value="">चुनें</option>
            <option value="low">कम</option>
            <option value="medium">मध्यम</option>
            <option value="high">उच्च</option>
            <option value="critical">गंभीर</option>
          </select>
        </label>
        <label>
          <span className="label">विवरण</span>
          <textarea className="input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'दर्ज हो रहा...' : 'शिकायत दर्ज करें'}
        </button>
      </form>
    </div>
  )
}
