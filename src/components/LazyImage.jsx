import { useState } from 'react'
import { getImageUrl } from '../lib/images'

export default function LazyImage({ src, alt, className, fallbackType, loading: loadingProp, ...props }) {
  const [error, setError] = useState(false)

  return (
    <img
      src={error ? null : getImageUrl(src, fallbackType)}
      alt={alt}
      className={className}
      loading={loadingProp || 'lazy'}
      onError={() => setError(true)}
      {...props}
    />
  )
}
