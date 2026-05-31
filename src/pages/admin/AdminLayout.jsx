import { Outlet, Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'डैशबोर्ड', icon: '📊' },
  { path: '/admin/population', label: 'जनसंख्या रिकॉर्ड', icon: '👥' },
  { path: '/admin/requests', label: 'शिकायतें', icon: '📋' },
  { path: '/admin/campaigns', label: 'अभियान', icon: '🎯' },
  { path: '/admin/work', label: 'कार्य', icon: '🔧' },
  { path: '/admin/pr', label: 'PR/समाचार', icon: '📰' },
  { path: '/admin/areas', label: 'क्षेत्र/गाँव', icon: '📍' },
  { path: '/admin/team', label: 'टीम', icon: '👤' },
  { path: '/admin/users', label: 'उपयोगकर्ता', icon: '👥' },
  { path: '/admin/roles', label: 'भूमिकाएँ', icon: '🔐' },
  { path: '/admin/reports', label: 'रिपोर्ट', icon: '📈' },
  { path: '/admin/settings', label: 'सेटिंग्स', icon: '⚙️' },
]

export default function AdminLayout({ user, onLogout }) {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
            <Link to="/admin/dashboard" className="text-base font-black text-slate-900">
              राकेश शुक्ला
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-slate-200 p-4">
            {user && (
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.role}</p>
                </div>
              </div>
            )}
            <Link to="/" className="mb-2 block text-xs font-semibold text-orange-600 hover:underline">
              ← सार्वजनिक साइट
            </Link>
            <button onClick={onLogout} className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-50">
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
