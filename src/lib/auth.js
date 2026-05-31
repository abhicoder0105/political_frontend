const STORAGE_KEY = 'political_session'
const LEGACY_KEY = 'political_user'

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.token && parsed?.user) return parsed
    return parsed?.id ? { token: null, user: parsed } : null
  } catch {
    return null
  }
}

export function getStoredUser() {
  return getStoredSession()?.user || null
}

export function getToken() {
  return getStoredSession()?.token || null
}

export function setStoredSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  localStorage.removeItem(LEGACY_KEY)
}

export function setStoredUser(session) {
  if (session?.token && session?.user) setStoredSession(session)
  else setStoredSession({ token: session?.token || null, user: session?.user || session })
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LEGACY_KEY)
}

export function isAdminUser(user) {
  return user && user.role && user.role !== 'public_user'
}
