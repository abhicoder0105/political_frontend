import { absoluteUrl } from './api'

const FALLBACKS = {
  banner: '/fallbacks/banner.svg',
  thumbnail: '/fallbacks/thumbnail.svg',
  profile: '/fallbacks/profile.svg',
  campaign: '/fallbacks/campaign.svg',
  news: '/fallbacks/news.svg',
  event: '/fallbacks/thumbnail.svg',
}

export function getImageUrl(path, type = 'thumbnail') {
  if (!path) return FALLBACKS[type] || FALLBACKS.thumbnail
  if (String(path).startsWith('/fallbacks/')) return path
  return absoluteUrl(path)
}

export function isValidImageFile(file) {
  return !file || /^image\/(png|jpe?g|webp|gif|svg\+xml)$/i.test(file.type)
}
