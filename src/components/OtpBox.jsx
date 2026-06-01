import { useEffect, useState } from 'react'
import { CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import { digitsOnly } from '../utils/forms'

export default function OtpBox({ phoneNumber, purpose = 'request', onVerified }) {
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [displayOtp, setDisplayOtp] = useState('')

  useEffect(() => {
    setOtp('')
    setSent(false)
    setVerified(false)
    setSeconds(0)
    setDisplayOtp('')
  }, [phoneNumber, purpose])

  useEffect(() => {
    if (!seconds) return
    const timer = setTimeout(() => setSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  async function sendOtp() {
    if (phoneNumber.length !== 10) {
      toast.error('मोबाइल नंबर 10 अंकों का होना चाहिए')
      return
    }
    setSending(true)
    try {
      const data = await apiRequest('/api/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phoneNumber, purpose }),
      })
      setSent(true)
      setSeconds(30)
      setDisplayOtp(data.otp || '')
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
      setVerified(true)
      setOtp('')
      toast.success('मोबाइल नंबर सत्यापित हुआ')
      onVerified?.(result)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${verified ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg p-2 ${verified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
            {verified ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <p className={`text-sm font-black ${verified ? 'text-emerald-800' : 'text-orange-800'}`}>
              {verified ? 'मोबाइल सत्यापित' : 'मोबाइल OTP सत्यापन'}
            </p>
            <p className={`mt-1 text-xs font-semibold ${verified ? 'text-emerald-700' : 'text-orange-700'}`}>
              {verified ? 'अब आप फॉर्म जमा कर सकते हैं।' : 'फॉर्म जमा करने से पहले OTP सत्यापन आवश्यक है।'}
            </p>
          </div>
        </div>

        {!verified && (
          <button
            type="button"
            onClick={sendOtp}
            disabled={sending || seconds > 0 || phoneNumber.length !== 10}
            className="btn-secondary"
          >
            <RefreshCw size={16} className={sending ? 'animate-spin' : ''} />
            {sending ? 'OTP भेज रहा है...' : seconds > 0 ? `फिर भेजें ${seconds}s` : sent ? 'OTP फिर भेजें' : 'OTP भेजें'}
          </button>
        )}
      </div>

      {sent && !verified && displayOtp && (
        <div className="mt-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-3 text-center">
          <p className="text-xs font-semibold text-amber-700">आपका OTP कोड</p>
          <p className="mt-1 text-3xl font-black tracking-widest text-amber-900 select-all">{displayOtp}</p>
          <p className="mt-1 text-xs text-amber-600">यह OTP 5 मिनट के लिए वैध है</p>
        </div>
      )}

      {sent && !verified && (
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            className="input bg-white"
            placeholder="6 अंकों का OTP"
            value={otp}
            onChange={(e) => setOtp(digitsOnly(e.target.value, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          <button type="button" onClick={verifyOtp} disabled={verifying || otp.length !== 6} className="btn-primary">
            {verifying ? 'जांच रहा है...' : 'OTP सत्यापित करें'}
          </button>
        </div>
      )}
    </div>
  )
}
