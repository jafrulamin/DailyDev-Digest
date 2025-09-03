import { fetchHN } from '../../../../lib/sources';
import { normalizeHN } from '../../../../lib/normalize';
import { getCache, setCache } from '../../../../lib/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  
  // Create a cache key
  const cacheKey = `hn:${query}`;
  
  // Check cache first
  const cached = getCache(cacheKey);
  if (cached) {
    return Response.json({ items: cached });
  }
  
  try {
    const results = await fetchHN(query);
    const normalizedItems = results.map(normalizeHN);
    
    // Store in cache
    setCache(cacheKey, normalizedItems);
    
    return Response.json({ items: normalizedItems });
  } catch (error) {
    console.error('HN API error:', error);
    return Response.json(
      { items: [] },
      { headers: { 'x-dd-error': 'true' } }
    );
  }
}