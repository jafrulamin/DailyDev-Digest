import { fetchDevto } from '../../../../lib/sources';
import { normalizeDevto } from '../../../../lib/normalize';
import { getCache, setCache } from '../../../../lib/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const tag = searchParams.get('tag') || '';
  
  // Create a cache key
  const cacheKey = `devto:${tag}:${query}`;
  
  // Check cache first
  const cached = getCache(cacheKey);
  if (cached) {
    return Response.json({ items: cached });
  }
  
  try {
    const results = await fetchDevto(tag, query);
    const normalizedItems = results.map(normalizeDevto);
    
    // Store in cache
    setCache(cacheKey, normalizedItems);
    
    return Response.json({ items: normalizedItems });
  } catch (error) {
    console.error('Dev.to API error:', error);
    return Response.json(
      { items: [] },
      { headers: { 'x-dd-error': 'true' } }
    );
  }
}