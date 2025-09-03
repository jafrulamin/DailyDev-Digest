// Simple CSV conversion utility

export function toCSV(items) {
  if (!items || !items.length) {
    return 'id,title,url,source,author,score,createdAt';
  }
  
  const headers = ['id', 'title', 'url', 'source', 'author', 'score', 'createdAt'];
  const headerRow = headers.join(',');
  
  const rows = items.map(item => {
    return headers.map(header => {
      let value = item[header];
      
      // Handle special cases
      if (header === 'title') {
        // Escape quotes in title
        value = value ? `"${value.replace(/"/g, '""')}"` : '';
      }
      
      return value !== undefined ? value : '';
    }).join(',');
  });
  
  return [headerRow, ...rows].join('\n');
}

export function downloadCSV(items, filename = 'dailydev-saved-items.csv') {
  const csvContent = toCSV(items);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}