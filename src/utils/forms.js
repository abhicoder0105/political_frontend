export function digitsOnly(value, maxLength) {
  const next = String(value || '').replace(/\D/g, '')
  return maxLength ? next.slice(0, maxLength) : next
}

export function nameOnly(value) {
  return String(value || '').replace(/[^\p{L} .'-]/gu, '')
}

export function isValidEmail(value) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validateImageFile(file) {
  return !file || /^image\/(png|jpe?g|webp|gif|svg\+xml)$/i.test(file.type)
}
