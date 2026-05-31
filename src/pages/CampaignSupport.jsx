import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { CheckCircle2, HandHeart } from 'lucide-react'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import OtpBox from '../components/OtpBox'
import { digitsOnly, nameOnly } from '../utils/forms'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

const initialForm = { name: '', phone_number: '', area: '', village_or_ward: '', message: '' }

export default function CampaignSupport() {
  const { id } = useParams()
  const [form, setForm] = useState({ campaign_id: id, ...initialForm })
  const [errors, setErrors] = useState({})
  const [verifiedPhone, setVerifiedPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

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
    if (!form.name.trim()) next.name = 'नाम आवश्यक है'
    if (form.phone_number.length !== 10) next.phone_number = 'मोबाइल नंबर 10 अंकों का होना चाहिए'
    if (verifiedPhone !== form.phone_number) next.otp = 'कृपया OTP सत्यापित करें'
    if (!form.area.trim()) next.area = 'क्षेत्र आवश्यक है'
    if (!form.village_or_ward.trim()) next.village_or_ward = 'गांव / वार्ड आवश्यक है'
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) document.getElementById(`support-${first}`)?.focus()
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
      <div className="app-container flex min-h-[60vh] items-center justify-center py-14">
        <div className="card-elevated max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 size={34} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">समर्थन के लिए धन्यवाद!</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">आपका समर्थन सफलतापूर्वक दर्ज हो गया है।</p>
          <Button as={Link} to="/campaigns" className="mt-6">अभियान पर वापस</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container py-14">
      <PageHeader
        eyebrow="जनभागीदारी"
        title="अभियान को समर्थन करें"
        description="अपना मोबाइल OTP से सत्यापित करके अभियान से जुड़ें।"
      />
      <form onSubmit={handleSubmit} className="card-elevated mx-auto max-w-3xl p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-orange-50 p-4 text-orange-800 ring-1 ring-orange-100">
          <HandHeart size={22} />
          <p className="text-sm font-bold">आपका समर्थन अभियान टीम तक सुरक्षित रूप से पहुंचेगा।</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="आपका नाम" error={errors.name} required>
            <input id="support-name" className="input" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </FormField>
          <FormField label="मोबाइल नंबर" error={errors.phone_number} required>
            <input id="support-phone_number" type="tel" className="input" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} inputMode="numeric" />
          </FormField>
          <div className="md:col-span-2">
            <OtpBox phoneNumber={form.phone_number} purpose="campaign_support" onVerified={() => setVerifiedPhone(form.phone_number)} />
            {errors.otp && <p className="field-error">{errors.otp}</p>}
          </div>
          <FormField label="क्षेत्र" error={errors.area} required>
            <input id="support-area" className="input" value={form.area} onChange={(e) => update('area', e.target.value)} />
          </FormField>
          <FormField label="गांव / वार्ड" error={errors.village_or_ward} required>
            <input id="support-village_or_ward" className="input" value={form.village_or_ward} onChange={(e) => update('village_or_ward', e.target.value)} />
          </FormField>
          <FormField label="संदेश" helper="वैकल्पिक" className="md:col-span-2">
            <textarea className="input min-h-28" value={form.message} onChange={(e) => update('message', e.target.value)} />
          </FormField>
        </div>
        <Button type="submit" disabled={submitting || verifiedPhone !== form.phone_number} className="mt-6 w-full">
          {submitting ? 'दर्ज हो रहा है...' : 'समर्थन करें'}
        </Button>
      </form>
    </div>
  )
}
