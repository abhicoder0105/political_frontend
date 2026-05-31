import { Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { getStoredUser, isAdminUser } from '../../lib/auth'
import { humanizeEnum } from '../../utils/enums'

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'डैशबोर्ड' },
  { path: '/admin/population', label: 'जनसंख्या रिकॉर्ड' },
  { path: '/admin/requests', label: 'अनुरोध' },
  { path: '/admin/campaigns', label: 'अभियान' },
  { path: '/admin/work', label: 'कार्य' },
  { path: '/admin/pr', label: 'समाचार' },
  { path: '/admin/areas', label: 'क्षेत्र/गांव' },
  { path: '/admin/team', label: 'टीम' },
  { path: '/admin/users', label: 'उपयोगकर्ता' },
  { path: '/admin/roles', label: 'भूमिकाएं' },
  { path: '/admin/reports', label: 'रिपोर्ट' },
  { path: '/admin/settings', label: 'सेटिंग्स' },
]

export default function AdminLayout({ user, onLogout }) {
  const location = useLocation()
  const activeUser = user || getStoredUser()

  if (!isAdminUser(activeUser)) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-4 py-4">
            <Link to="/admin/dashboard" className="text-base font-black text-slate-900">
              राकेश शुक्ला
            </Link>
            <p className="mt-1 text-xs font-semibold text-slate-500">प्रशासन पैनल</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                {activeUser.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">{activeUser.name}</p>
                <p className="truncate text-xs text-slate-400">{humanizeEnum(activeUser.role)}</p>
              </div>
            </div>
            <Link to="/" className="mb-2 block text-xs font-semibold text-orange-600 hover:underline">
              ← सार्वजनिक साइट
            </Link>
            <button
              onClick={onLogout}
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-50"
            >
              लॉगआउट
            </button>
          </div>
        </div>
      </aside>
      <main className="ml-64 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
