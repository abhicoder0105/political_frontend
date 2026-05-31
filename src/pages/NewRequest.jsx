import { useEffect, useState } from 'react'
import { CheckCircle2, FileText, HandHeart, MapPin, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import OtpBox from '../components/OtpBox'
import { CATEGORIES } from '../constants'
import { digitsOnly, nameOnly } from '../utils/forms'
import { humanizeEnum } from '../utils/enums'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

const FORM_TYPES = [
  { key: 'complaint', label: 'शिकायत', title: 'नई शिकायत दर्ज करें', defaultCategory: 'water', icon: FileText },
  { key: 'development', label: 'विकास अनुरोध', title: 'विकास कार्य का अनुरोध', defaultCategory: 'road', icon: Wrench },
  { key: 'help', label: 'जन सहायता', title: 'जन सहायता / अन्य अनुरोध', defaultCategory: 'other', icon: HandHeart },
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
  const [errors, setErrors] = useState({})
  const [verifiedPhone, setVerifiedPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  useEffect(() => {
    setForm((current) => ({ ...current, category: type.defaultCategory }))
    setErrors({})
  }, [type])

  function update(field, value) {
    const next =
      field === 'phone_number' ? digitsOnly(value, 10) :
      field === 'name' ? nameOnly(value) :
      value
    setForm((current) => ({ ...current, [field]: next }))
    setErrors((current) => ({ ...current, [field]: '' }))
    if (field === 'phone_number') setVerifiedPhone('')
  }

  function validate() {
    const next = {}
    if (!form.request_title.trim()) next.request_title = 'शीर्षक आवश्यक है'
    if (!form.name.trim()) next.name = 'नाम आवश्यक है'
    if (form.phone_number.length !== 10) next.phone_number = 'मोबाइल नंबर 10 अंकों का होना चाहिए'
    if (verifiedPhone !== form.phone_number) next.otp = 'कृपया मोबाइल OTP सत्यापित करें'
    if (!form.area.trim()) next.area = 'क्षेत्र आवश्यक है'
    if (!form.village_or_ward.trim()) next.village_or_ward = 'गांव / वार्ड आवश्यक है'
    if (!form.category) next.category = 'श्रेणी आवश्यक है'
    if (form.description.trim().length < 10) next.description = 'विवरण कम से कम 10 अक्षरों का होना चाहिए'
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) document.getElementById(`request-${first}`)?.focus()
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) {
      toast.error('कृपया फॉर्म की त्रुटियां ठीक करें')
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
      <div className="app-container flex min-h-[60vh] items-center justify-center py-14">
        <div className="card-elevated max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 size={34} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">अनुरोध दर्ज हो गया</h2>
          <p className="mt-2 text-slate-600">आपकी शिकायत ID: <strong>{submitted.id}</strong></p>
          <Button onClick={() => setSubmitted(null)} className="mt-6">
            नया अनुरोध दर्ज करें
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container py-14">
      <PageHeader
        eyebrow="जनसुनवाई"
        title="अनुरोध / शिकायत दर्ज करें"
        description="तीन सरल फॉर्म, मोबाइल OTP सत्यापन और सीधे backend tracking के साथ।"
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {FORM_TYPES.map((item) => {
          const Icon = item.icon
          const active = item.key === type.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setType(item)}
              className={`rounded-lg border p-4 text-left transition-all ${
                active
                  ? 'border-orange-300 bg-orange-50 text-orange-800 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/60'
              }`}
            >
              <Icon size={20} />
              <p className="mt-3 font-black">{item.label}</p>
              <p className="mt-1 text-xs font-semibold opacity-75">{item.title}</p>
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="card-elevated p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100">
          <MapPin className="text-orange-700" size={22} />
          <div>
            <h2 className="font-black text-slate-950">{type.title}</h2>
            <p className="text-sm text-slate-600">सभी आवश्यक जानकारी भरें और मोबाइल OTP सत्यापित करें।</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="शीर्षक" error={errors.request_title} required className="md:col-span-2">
            <input id="request-request_title" className="input" value={form.request_title} onChange={(e) => update('request_title', e.target.value)} placeholder="समस्या / अनुरोध का छोटा शीर्षक" />
          </FormField>
          <FormField label="आपका नाम" error={errors.name} required>
            <input id="request-name" className="input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="पूरा नाम" />
          </FormField>
          <FormField label="मोबाइल नंबर" error={errors.phone_number} required>
            <input id="request-phone_number" type="tel" className="input" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} inputMode="numeric" placeholder="10 अंकों का नंबर" />
          </FormField>
          <div className="md:col-span-2">
            <OtpBox phoneNumber={form.phone_number} purpose="request" onVerified={() => setVerifiedPhone(form.phone_number)} />
            {errors.otp && <p className="field-error">{errors.otp}</p>}
          </div>
          <FormField label="क्षेत्र" error={errors.area} required>
            <input id="request-area" className="input" value={form.area} onChange={(e) => update('area', e.target.value)} placeholder="क्षेत्र / मंडल" />
          </FormField>
          <FormField label="गांव / वार्ड" error={errors.village_or_ward} required>
            <input id="request-village_or_ward" className="input" value={form.village_or_ward} onChange={(e) => update('village_or_ward', e.target.value)} placeholder="गांव या वार्ड" />
          </FormField>
          <FormField label="श्रेणी" error={errors.category} required className="md:col-span-2">
            <select id="request-category" className="input" value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{humanizeEnum(category)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="विवरण" error={errors.description} required className="md:col-span-2" helper="कम से कम 10 अक्षर लिखें।">
            <textarea id="request-description" className="input min-h-32" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="समस्या या अनुरोध का पूरा विवरण लिखें" />
          </FormField>
          <FormField label="छवि URL" helper="वैकल्पिक">
            <input className="input" value={form.image_url} onChange={(e) => update('image_url', e.target.value)} placeholder="https://..." />
          </FormField>
          <FormField label="दस्तावेज URL" helper="वैकल्पिक">
            <input className="input" value={form.document_url} onChange={(e) => update('document_url', e.target.value)} placeholder="https://..." />
          </FormField>
        </div>
        <Button type="submit" disabled={submitting || verifiedPhone !== form.phone_number} className="mt-6 w-full">
          {submitting ? 'दर्ज हो रहा है...' : 'अनुरोध दर्ज करें'}
        </Button>
      </form>
    </div>
  )
}
