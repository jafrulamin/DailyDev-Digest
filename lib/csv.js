// convert items to CSV format
export function toCSV(items) {
  if (!items || items.length === 0) return ''
  
  // CSV headers
  const headers = ['id', 'title', 'url', 'source', 'author', 'score', 'createdAt']
  
  // escape CSV values (handle commas and quotes)
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return ''
    const stringValue = String(value)
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }
  
  // create CSV rows
  const rows = items.map(item => 
    headers.map(header => escapeCSV(item[header])).join(',')
  )
  
  // combine headers and rows
  return [headers.join(','), ...rows].join('\n')
}
