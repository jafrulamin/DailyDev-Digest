// convert time to "5m ago", "3h ago", etc.
export function timeAgo(dateOrMs) {
  const now = Date.now()
  const time = typeof dateOrMs === 'number' ? dateOrMs : new Date(dateOrMs).getTime()
  const diff = now - time
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return new Date(time).toLocaleDateString()
}
