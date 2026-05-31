import { Outlet, Link } from 'react-router-dom'
import { getStoredUser } from '../lib/auth'

export default function PublicLayout({ user, onLogout }) {
  const currentUser = user || getStoredUser()

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-black text-slate-900">
            राकेश शुक्ला CRM
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-orange-600">होम</Link>
            <Link to="/news" className="hover:text-orange-600">समाचार</Link>
            <Link to="/campaigns" className="hover:text-orange-600">अभियान</Link>
            <Link to="/request/new" className="hover:text-orange-600">शिकायत</Link>
            <Link to="/request/status" className="hover:text-orange-600">स्थिति</Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="hover:text-orange-600">प्रोफाइल</Link>
                {currentUser.role !== 'public_user' && (
                  <Link to="/admin/dashboard" className="rounded-lg bg-orange-600 px-3 py-1.5 text-white hover:bg-orange-700">
                    एडमिन
                  </Link>
                )}
                <button onClick={onLogout} className="text-red-600 hover:text-red-700">लॉगआउट</button>
              </>
            ) : (
              <Link to="/login" className="rounded-lg bg-orange-600 px-3 py-1.5 text-white hover:bg-orange-700">
                लॉगिन
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
