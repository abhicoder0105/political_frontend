import { useState } from 'react'
import { getImageUrl } from '../lib/images'

export default function LazyImage({ src, alt, className, fallbackType = 'thumbnail', loading: loadingProp, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(getImageUrl(src, fallbackType))

  return (
    <img
      src={currentSrc}
      alt={alt || ''}
      className={className}
      loading={loadingProp || 'lazy'}
      onError={() => setCurrentSrc(getImageUrl(null, fallbackType))}
      {...props}
    />
  )
}
