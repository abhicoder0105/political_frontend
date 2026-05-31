const API_BASE = import.meta.env.VITE_API_URL || ''

export async function apiRequest(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem('political_user') || 'null')
    return user?.token || null
  } catch {
    return null
  }
}
