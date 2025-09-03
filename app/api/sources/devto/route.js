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
    console.log('Dev.to cache hit for:', {tag, query});
    return Response.json({ items: cached });
  }
  
  console.log('Fetching from Dev.to API with:', {tag, query});
  
  try {
    const results = await fetchDevto(tag, query);
    console.log(`Dev.to API returned ${results.length} results`);
    
    // Filter out null items after normalization
    const normalizedItems = results
      .map(normalizeDevto)
      .filter(item => item !== null);
    
    // Store in cache
    setCache(cacheKey, normalizedItems);
    
    return Response.json({ items: normalizedItems });
  } catch (error) {
    console.error('Dev.to API error:', error);
    return Response.json(
      { items: [], error: error.message },
      { headers: { 'x-dd-error': 'true' } }
    );
  }
}