import { fetchHN, fetchDevto, fetchReddit } from '../../../lib/sources'
import { getCache, setCache } from '../../../lib/cache'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const source = searchParams.get('source') || 'all'
    const tag = searchParams.get('tag') || ''

    // check cache first
    const cacheKey = JSON.stringify({ source, query, tag })
    const cached = getCache(cacheKey)
    if (cached) {
      return Response.json({ items: cached })
    }

    let allItems = []

    // fetch from specific source or all sources
    if (source === 'all' || source === 'hn') {
      const hnItems = await fetchHN(query)
      allItems.push(...hnItems)
    }

    if (source === 'all' || source === 'devto') {
      const devtoItems = await fetchDevto(tag, query)
      allItems.push(...devtoItems)
    }

    if (source === 'all' || source === 'reddit') {
      const redditItems = await fetchReddit(query)
      allItems.push(...redditItems)
    }

    // sort by newest first, then by score
    allItems.sort((a, b) => {
      if (b.createdAt !== a.createdAt) {
        return b.createdAt - a.createdAt
      }
      return (b.score || 0) - (a.score || 0)
    })

    // cache the result
    setCache(cacheKey, allItems)

    return Response.json({ items: allItems })
  } catch (error) {
    console.error('Aggregate API error:', error)
    return Response.json(
      { items: [] },
      { headers: { 'x-dd-error': 'true' } }
    )
  }
}
