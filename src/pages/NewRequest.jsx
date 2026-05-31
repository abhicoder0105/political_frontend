import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import OtpBox from '../components/OtpBox'
import { CATEGORIES } from '../constants'
import { digitsOnly, nameOnly } from '../utils/forms'
import { humanizeEnum } from '../utils/enums'

const FORM_TYPES = [
  { key: 'complaint', label: 'शिकायत', title: 'नई शिकायत दर्ज करें', defaultCategory: 'water' },
  { key: 'development', label: 'विकास अनुरोध', title: 'विकास कार्य का अनुरोध', defaultCategory: 'road' },
  { key: 'help', label: 'जन सहायता', title: 'जन सहायता / अन्य अनुरोध', defaultCategory: 'other' },
]

const initialForm = {
  request_title: '',
  name: '',
  phone_number: '',
  area: '',
  village_or_ward: '',
  category: 'water',
  description: '',
  image_url: '',
  document_url: '',
}

export default function NewRequest() {
  const [type, setType] = useState(FORM_TYPES[0])
  const [form, setForm] = useState(initialForm)
  const [verifiedPhone, setVerifiedPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  useEffect(() => {
    setForm((current) => ({ ...current, category: type.defaultCategory }))
  }, [type])

  function update(field, value) {
    const next =
      field === 'phone_number' ? digitsOnly(value, 10) :
      field === 'name' ? nameOnly(value) :
      value
    setForm((current) => ({ ...current, [field]: next }))
    if (field === 'phone_number') setVerifiedPhone('')
  }

  function validate() {
    if (!form.request_title.trim()) return 'शीर्षक आवश्यक है'
    if (!form.name.trim()) return 'नाम आवश्यक है'
    if (form.phone_number.length !== 10) return 'मोबाइल नंबर 10 अंकों का होना चाहिए'
    if (verifiedPhone !== form.phone_number) return 'कृपया मोबाइल OTP सत्यापित करें'
    if (!form.area.trim()) return 'क्षेत्र आवश्यक है'
    if (!form.village_or_ward.trim()) return 'गांव/वार्ड आवश्यक है'
    if (!form.category) return 'श्रेणी आवश्यक है'
    if (form.description.trim().length < 10) return 'विवरण कम से कम 10 अक्षरों का होना चाहिए'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    setSubmitting(true)
    try {
      const result = await apiRequest('/api/public/requests', {
        method: 'POST',
        body: JSON.stringify({ public_request: form }),
      })
      toast.success(result?.message || 'अनुरोध सफलतापूर्वक दर्ज हुआ')
      setSubmitted(result?.request)
      setForm(initialForm)
      setVerifiedPhone('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="text-5xl">✓</span>
        <h2 className="mt-4 text-2xl font-black text-slate-900">अनुरोध दर्ज हो गया</h2>
        <p className="mt-2 text-slate-500">आपकी शिकायत ID: <strong>{submitted.id}</strong></p>
        <button onClick={() => setSubmitted(null)} className="btn-primary mt-6">
          नया अनुरोध दर्ज करें
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-6 flex flex-wrap gap-2">
        {FORM_TYPES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setType(item)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${item.key === type.key ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">{type.title}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="label">शीर्षक</span>
            <input className="input" value={form.request_title} onChange={(e) => update('request_title', e.target.value)} required />
          </label>
          <label>
            <span className="label">आपका नाम</span>
            <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </label>
          <label>
            <span className="label">मोबाइल नंबर</span>
            <input type="tel" className="input" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} inputMode="numeric" required />
          </label>
          <div className="md:col-span-2">
            <OtpBox phoneNumber={form.phone_number} purpose="request" onVerified={() => setVerifiedPhone(form.phone_number)} />
          </div>
          <label>
            <span className="label">क्षेत्र</span>
            <input className="input" value={form.area} onChange={(e) => update('area', e.target.value)} required />
          </label>
          <label>
            <span className="label">गांव / वार्ड</span>
            <input className="input" value={form.village_or_ward} onChange={(e) => update('village_or_ward', e.target.value)} required />
          </label>
          <label className="md:col-span-2">
            <span className="label">श्रेणी</span>
            <select className="input" value={form.category} onChange={(e) => update('category', e.target.value)} required>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{humanizeEnum(category)}</option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="label">विवरण</span>
            <textarea className="input min-h-28" value={form.description} onChange={(e) => update('description', e.target.value)} required />
          </label>
          <label>
            <span className="label">छवि URL (वैकल्पिक)</span>
            <input className="input" value={form.image_url} onChange={(e) => update('image_url', e.target.value)} />
          </label>
          <label>
            <span className="label">दस्तावेज URL (वैकल्पिक)</span>
            <input className="input" value={form.document_url} onChange={(e) => update('document_url', e.target.value)} />
          </label>
        </div>
        <button type="submit" disabled={submitting || verifiedPhone !== form.phone_number} className="btn-primary w-full">
          {submitting ? 'दर्ज हो रहा है...' : 'अनुरोध दर्ज करें'}
        </button>
      </form>
    </div>
  )
}
