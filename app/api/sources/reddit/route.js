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
    console.log('Reddit cache hit for:', query);
    return Response.json({ items: cached });
  }
  
  console.log('Fetching from Reddit API with query:', query);
  
  try {
    // Use our updated fetchReddit function that calls the proxy
    const results = await fetchReddit(query);
    console.log(`Reddit API returned ${results.length} results`);
    
    // Filter out null items after normalization
    const normalizedItems = results
      .map(normalizeReddit)
      .filter(item => item !== null);
    
    // Store in cache
    setCache(cacheKey, normalizedItems);
    
    return Response.json({ items: normalizedItems });
  } catch (error) {
    console.error('Reddit API error:', error);
    return Response.json(
      { items: [], error: error.message },
      { headers: { 'x-dd-error': 'true' } }
    );
  }
}