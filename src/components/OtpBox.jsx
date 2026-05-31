import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import { digitsOnly } from '../utils/forms'

export default function OtpBox({ phoneNumber, purpose = 'request', onVerified }) {
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sent, setSent] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    setOtp('')
    setSent(false)
    setSeconds(0)
  }, [phoneNumber, purpose])

  useEffect(() => {
    if (!seconds) return
    const timer = setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  async function sendOtp() {
    if (phoneNumber.length !== 10) {
      toast.error('मोबाइल नंबर 10 अंकों का होना चाहिए')
      return
    }
    setSending(true)
    try {
      await apiRequest('/api/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phoneNumber, purpose }),
      })
      setSent(true)
      setSeconds(30)
      toast.success('OTP भेजा गया')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  async function verifyOtp() {
    if (otp.length !== 6) {
      toast.error('OTP 6 अंकों का होना चाहिए')
      return
    }
    setVerifying(true)
    try {
      const result = await apiRequest('/api/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phoneNumber, otp, purpose }),
      })
      toast.success('मोबाइल नंबर सत्यापित हुआ')
      onVerified?.(result)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={sendOtp} disabled={sending || seconds > 0 || phoneNumber.length !== 10} className="btn-secondary">
          {sending ? 'OTP भेज रहा है...' : seconds > 0 ? `फिर भेजें ${seconds}s` : sent ? 'OTP फिर भेजें' : 'OTP भेजें'}
        </button>
        <input
          className="input sm:max-w-40"
          placeholder="6 अंकों का OTP"
          value={otp}
          onChange={(e) => setOtp(digitsOnly(e.target.value, 6))}
          inputMode="numeric"
          disabled={!sent}
        />
        <button type="button" onClick={verifyOtp} disabled={!sent || verifying || otp.length !== 6} className="btn-primary">
          {verifying ? 'जांच रहा है...' : 'OTP सत्यापित करें'}
        </button>
      </div>
      <p className="mt-2 text-xs font-semibold text-orange-700">फॉर्म जमा करने से पहले मोबाइल सत्यापन आवश्यक है।</p>
    </div>
  )
}
