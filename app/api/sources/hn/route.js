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
    console.log('HN cache hit for:', query);
    return Response.json({ items: cached });
  }
  
  console.log('Fetching from HN API with query:', query);
  
  try {
    const results = await fetchHN(query);
    console.log(`HN API returned ${results.length} results`);
    
    // Filter out null items after normalization
    const normalizedItems = results
      .map(normalizeHN)
      .filter(item => item !== null);
    
    // Store in cache
    setCache(cacheKey, normalizedItems);
    
    return Response.json({ items: normalizedItems });
  } catch (error) {
    console.error('HN API error:', error);
    return Response.json(
      { items: [], error: error.message },
      { headers: { 'x-dd-error': 'true' } }
    );
  }
}