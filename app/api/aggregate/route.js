import { getCache, setCache } from '../../../lib/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const source = searchParams.get('source') || 'all';
  const tag = searchParams.get('tag') || '';
  
  console.log('Aggregate API request:', { source, query, tag });
  
  // Create a cache key based on the request params
  const cacheKey = JSON.stringify({ source, query, tag });
  
  // Check cache first (5 minute TTL)
  const cached = getCache(cacheKey);
  if (cached) {
    console.log('Aggregate cache hit for:', { source, query, tag });
    return Response.json({ items: cached });
  }
  
  // Determine which sources to fetch from
  const sources = source === 'all' ? ['hn', 'devto', 'reddit'] : [source];
  
  try {
    // Get current host for API calls
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    
    // Fetch from all required sources in parallel
    const promises = sources.map(src => {
      const url = new URL(`${baseUrl}/api/sources/${src}`);
      
      if (query) url.searchParams.append('query', query);
      if (tag && src === 'devto') url.searchParams.append('tag', tag);
      
      console.log(`Fetching from ${url.toString()}`);
      
      return fetch(url.toString())
        .then(res => res.json())
        .then(data => {
          console.log(`${src} returned ${data.items?.length || 0} items`);
          return data.items || [];
        })
        .catch(err => {
          console.error(`Error fetching from ${src}:`, err);
          return [];
        });
    });
    
    // Wait for all requests to complete
    const results = await Promise.all(promises);
    
    // Merge all results into a single array
    const merged = results.flat().filter(Boolean);
    
    // Sort by newest first, then by score
    const sorted = merged.sort((a, b) => {
      // Sort by creation date (newest first)
      const dateComparison = b.createdAt - a.createdAt;
      if (dateComparison !== 0) return dateComparison;
      
      // If dates are the same, sort by score (highest first)
      return b.score - a.score;
    });
    
    console.log(`Aggregate returning ${sorted.length} total items`);
    
    // Cache the result
    setCache(cacheKey, sorted);
    
    return Response.json({ items: sorted });
  } catch (error) {
    console.error('Aggregate API error:', error);
    return Response.json({ 
      items: [], 
      error: error.message 
    });
  }
}