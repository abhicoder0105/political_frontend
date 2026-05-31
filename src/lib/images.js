export function getImageUrl(path, size) {
  if (!path) return null
  if (path.startsWith('http')) return path
  if (size === 'thumbnail') {
    return path.replace(/\/images\//, '/thumbnails/')
  }
  return path
}
