import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, ShieldCheck, Phone, MapPin } from 'lucide-react'
import { getStoredUser, isAdminUser } from '../lib/auth'
import Button from '../components/ui/Button'

const NAV = [
  { to: '/', label: 'होम' },
  { to: '/profile', label: 'प्रोफाइल' },
  { to: '/news', label: 'समाचार' },
  { to: '/campaigns', label: 'अभियान' },
  { to: '/request/new', label: 'अनुरोध' },
  { to: '/request/status', label: 'स्थिति' },
]

export default function PublicLayout({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const currentUser = user || getStoredUser()

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  function navClass(to) {
    const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
    return `rounded-lg px-3 py-2 text-sm font-black transition-all ${
      active ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    }`
  }

  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <header className="sticky top-0 z-[70] border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="app-container flex items-center justify-between py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMobileMenu}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-sm font-black text-white shadow-sm">
              रा
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-black leading-tight text-slate-950">राकेश शुक्ला</p>
              <p className="truncate text-xs font-bold text-slate-500">जनसेवा डिजिटल मंच</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={navClass(item.to)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {isAdminUser(currentUser) && (
              <Button as={Link} to="/admin/dashboard" variant="secondary" size="sm">
                <ShieldCheck size={16} />
                एडमिन
              </Button>
            )}
            {currentUser ? (
              <Button type="button" onClick={onLogout} variant="ghost" size="sm">
                लॉगआउट
              </Button>
            ) : (
              <Button as={Link} to="/login" size="sm">
                एडमिन लॉगिन
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-orange-100 lg:hidden"
            aria-label={mobileMenuOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'}
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-menu"
          >
            {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div id="public-mobile-menu" className="fixed inset-x-0 bottom-0 top-[65px] z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            onClick={closeMobileMenu}
            aria-label="मेन्यू के बाहर क्लिक करके बंद करें"
          />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[88vw] overflow-y-auto border-l border-slate-200 bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-black text-slate-950">मेन्यू</p>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-orange-100"
                aria-label="मेन्यू बंद करें"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav className="grid gap-1">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} className={navClass(item.to)} onClick={closeMobileMenu}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
              {isAdminUser(currentUser) && (
                <Button as={Link} to="/admin/dashboard" variant="secondary" onClick={closeMobileMenu}>
                  <ShieldCheck size={16} />
                  एडमिन डैशबोर्ड
                </Button>
              )}
              {currentUser ? (
                <Button type="button" onClick={() => { closeMobileMenu(); onLogout?.() }} variant="ghost">
                  लॉगआउट
                </Button>
              ) : (
                <Button as={Link} to="/login" onClick={closeMobileMenu}>
                  एडमिन लॉगिन
                </Button>
              )}
            </div>
          </aside>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="app-container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <h2 className="text-lg font-black text-slate-950">राकेश शुक्ला</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              अभियान, जनसंपर्क, विकास कार्य और नागरिक अनुरोधों के लिए एक भरोसेमंद डिजिटल प्लेटफॉर्म।
            </p>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">त्वरित लिंक</p>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
              <Link to="/request/new" className="hover:text-orange-700">अनुरोध दर्ज करें</Link>
              <Link to="/campaigns" className="hover:text-orange-700">अभियान देखें</Link>
              <Link to="/news" className="hover:text-orange-700">समाचार</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">संपर्क</p>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
              <p className="flex items-center gap-2"><MapPin size={16} /> मेहगांव क्षेत्र</p>
              <p className="flex items-center gap-2"><Phone size={16} /> जनसंपर्क कार्यालय</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
