import { useEffect, useState } from 'react'
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { BarChart3, FileText, Map, Menu, Megaphone, Newspaper, Settings, Shield, Users, X } from 'lucide-react'
import { getStoredUser, isAdminUser } from '../../lib/auth'
import { humanizeEnum } from '../../utils/enums'

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'डैशबोर्ड', icon: BarChart3 },
  { path: '/admin/population', label: 'जनसंख्या रिकॉर्ड', icon: Users },
  { path: '/admin/requests', label: 'अनुरोध', icon: FileText },
  { path: '/admin/campaigns', label: 'अभियान', icon: Megaphone },
  { path: '/admin/work', label: 'कार्य', icon: Shield },
  { path: '/admin/pr', label: 'समाचार', icon: Newspaper },
  { path: '/admin/areas', label: 'क्षेत्र/गांव', icon: Map },
  { path: '/admin/team', label: 'टीम', icon: Users },
  { path: '/admin/users', label: 'उपयोगकर्ता', icon: Users },
  { path: '/admin/roles', label: 'भूमिकाएं', icon: Shield },
  { path: '/admin/reports', label: 'रिपोर्ट', icon: BarChart3 },
  { path: '/admin/settings', label: 'सेटिंग्स', icon: Settings },
]

export default function AdminLayout({ user, onLogout }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const activeUser = user || getStoredUser()

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileSidebarOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileSidebarOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileSidebarOpen])

  if (!isAdminUser(activeUser)) return <Navigate to="/login" replace />

  const closeMobileSidebar = () => setMobileSidebarOpen(false)

  function Sidebar() {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="border-b border-slate-200 px-4 py-4">
          <Link to="/admin/dashboard" className="flex items-center gap-3" onClick={closeMobileSidebar}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-sm font-black text-white">रा</div>
            <div className="min-w-0">
              <p className="truncate text-base font-black text-slate-950">राकेश शुक्ला</p>
              <p className="truncate text-xs font-bold text-slate-500">प्रशासन पैनल</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-black transition-all ${
                  active ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-700">
              {activeUser.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-900">{activeUser.name}</p>
              <p className="truncate text-xs font-semibold text-slate-500">{humanizeEnum(activeUser.role)}</p>
            </div>
          </div>
          <Link to="/" onClick={closeMobileSidebar} className="btn-secondary mb-2 w-full">
            सार्वजनिक साइट
          </Link>
          <button
            type="button"
            onClick={() => {
              closeMobileSidebar()
              onLogout()
            }}
            className="btn-danger w-full"
          >
            लॉगआउट
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-white lg:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-[70] border-b border-slate-200 bg-white/95 backdrop-blur lg:ml-72">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-2">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-orange-100 lg:hidden"
            aria-label={mobileSidebarOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'}
            aria-expanded={mobileSidebarOpen}
            aria-controls="admin-mobile-sidebar"
          >
            {mobileSidebarOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>

          <div className="hidden lg:block">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">Admin</p>
            <p className="text-sm font-bold text-slate-600">डेटा, अभियान और नागरिक अनुरोध प्रबंधन</p>
          </div>

          <p className="ml-auto truncate text-sm font-black text-slate-900">{activeUser.name}</p>
        </div>
      </header>

      {mobileSidebarOpen && (
        <div id="admin-mobile-sidebar" className="fixed inset-x-0 bottom-0 top-16 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50"
            onClick={closeMobileSidebar}
            aria-label="मेन्यू बंद करें"
          />

          <aside className="absolute left-0 top-0 h-full w-80 max-w-[88vw] overflow-y-auto bg-white shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-orange-100"
              onClick={closeMobileSidebar}
              aria-label="बंद करें"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      <main className="lg:ml-72">
        <Outlet />
      </main>
    </div>
  )
}
