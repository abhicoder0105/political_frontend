import { clearStoredUser, getToken } from './auth'

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export function absoluteUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const text = res.status === 204 ? '' : await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { error: text }
  }

  if (res.status === 401) {
    clearStoredUser()
    throw new Error('कृपया फिर से लॉगिन करें')
  }

  if (!res.ok) {
    const errors = Array.isArray(data?.errors) ? data.errors.join(', ') : data?.errors
    const message = data?.error || errors || data?.message || `अनुरोध विफल हुआ: ${res.status}`
    throw new Error(message)
  }

  return data
}
