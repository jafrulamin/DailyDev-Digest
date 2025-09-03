import { getCache, setCache } from '../../../lib/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const source = searchParams.get('source') || 'all';
  const tag = searchParams.get('tag') || '';
  
  // Create a cache key based on the request params
  const cacheKey = JSON.stringify({ source, query, tag });
  
  // Check cache first (5 minute TTL)
  const cached = getCache(cacheKey);
  if (cached) {
    return Response.json({ items: cached });
  }
  
  // Determine which sources to fetch from
  const sources = source === 'all' ? ['hn', 'devto', 'reddit'] : [source];
  
  try {
    // Fetch from all required sources in parallel
    const promises = sources.map(src => {
      const url = new URL(`${request.headers.get('host') || 'localhost:3000'}/api/sources/${src}`);
      
      if (query) url.searchParams.append('query', query);
      if (tag && src === 'devto') url.searchParams.append('tag', tag);
      
      return fetch(url.toString())
        .then(res => res.json())
        .then(data => data.items || [])
        .catch(err => {
          console.error(`Error fetching from ${src}:`, err);
          return [];
        });
    });
    
    // Wait for all requests to complete
    const results = await Promise.all(promises);
    
    // Merge and sort by newest first, then by score
    const merged = results.flat().sort((a, b) => {
      // Sort by creation date (newest first)
      const dateComparison = b.createdAt - a.createdAt;
      if (dateComparison !== 0) return dateComparison;
      
      // If dates are the same, sort by score (highest first)
      return b.score - a.score;
    });
    
    // Cache the result
    setCache(cacheKey, merged);
    
    return Response.json({ items: merged });
  } catch (error) {
    console.error('Aggregate API error:', error);
    return Response.json({ items: [] });
  }
}