export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString('hi-IN')
}
