import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import { setStoredSession } from '../lib/auth'
import { digitsOnly } from '../utils/forms'

export default function Login({ setUser }) {
  const [form, setForm] = useState({ mobile_number: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.mobile_number.length !== 10) {
      toast.error('मोबाइल नंबर 10 अंकों का होना चाहिए')
      return
    }
    if (!form.password) {
      toast.error('पासवर्ड आवश्यक है')
      return
    }

    setLoading(true)
    try {
      const session = await apiRequest('/api/auth/admin_login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setStoredSession(session)
      setUser(session.user)
      toast.success('एडमिन लॉगिन सफल')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center text-2xl font-black text-slate-900">एडमिन लॉगिन</h1>
      <p className="mt-2 text-center text-sm text-slate-500">Rails backend के एडमिन खाते से लॉगिन करें।</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label>
          <span className="label">मोबाइल नंबर</span>
          <input
            type="tel"
            className="input"
            value={form.mobile_number}
            onChange={(e) => setForm({ ...form, mobile_number: digitsOnly(e.target.value, 10) })}
            inputMode="numeric"
            required
          />
        </label>
        <label>
          <span className="label">पासवर्ड</span>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन'}
        </button>
      </form>
    </div>
  )
}
