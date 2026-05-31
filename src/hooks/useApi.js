import { useState, useEffect, useCallback } from 'react'
import { apiRequest } from '../lib/api'

export default function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!url) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await apiRequest(url)
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}
