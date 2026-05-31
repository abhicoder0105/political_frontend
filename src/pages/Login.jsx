import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { setStoredUser } from '../lib/auth'
import { toast } from 'sonner'

export default function Login({ setUser }) {
  const [form, setForm] = useState({ mobile_number: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ user: form }),
      })
      setStoredUser(res.user || res)
      setUser(res.user || res)
      toast.success('लॉगिन सफल')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-black text-center text-slate-900">लॉगिन</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label>
          <span className="label">मोबाइल नंबर</span>
          <input
            type="tel"
            className="input"
            value={form.mobile_number}
            onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
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
          {loading ? 'लॉगिन हो रहा...' : 'लॉगिन'}
        </button>
      </form>
    </div>
  )
}
