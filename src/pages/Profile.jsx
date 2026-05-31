import { getStoredUser } from '../lib/auth'

export default function Profile() {
  const user = getStoredUser()

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h2 className="text-xl font-black text-slate-900">कृपया लॉगिन करें</h2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-black text-slate-900">प्रोफाइल</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <span className="label">नाम</span>
          <p className="font-semibold text-slate-800">{user.name}</p>
        </div>
        <div>
          <span className="label">मोबाइल नंबर</span>
          <p className="font-semibold text-slate-800">{user.mobile_number}</p>
        </div>
        <div>
          <span className="label">भूमिका</span>
          <p className="font-semibold text-slate-800">{user.role}</p>
        </div>
        <div>
          <span className="label">क्षेत्र</span>
          <p className="font-semibold text-slate-800">{user.area || '-'}</p>
        </div>
      </div>
    </div>
  )
}
