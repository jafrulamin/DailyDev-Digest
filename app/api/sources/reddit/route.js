import { fetchReddit } from '../../../../lib/sources';
import { normalizeReddit } from '../../../../lib/normalize';
import { getCache, setCache } from '../../../../lib/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  
  // Create a cache key
  const cacheKey = `reddit:${query}`;
  
  // Check cache first
  const cached = getCache(cacheKey);
  if (cached) {
    return Response.json({ items: cached });
  }
  
  try {
    const results = await fetchReddit(query);
    const normalizedItems = results.map(normalizeReddit);
    
    // Store in cache
    setCache(cacheKey, normalizedItems);
    
    return Response.json({ items: normalizedItems });
  } catch (error) {
    console.error('Reddit API error:', error);
    return Response.json(
      { items: [] },
      { headers: { 'x-dd-error': 'true' } }
    );
  }
}