import { fetchDevto } from '../../../lib/sources'
import { getCache, setCache } from '../../../lib/cache'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query') || ''
        const tag = searchParams.get('tag') || ''

        // check cache first
        const cacheKey = `devto:${tag}:${query}`
        const cached = getCache(cacheKey)
        if (cached) {
            return Response.json({ items: cached })
        }

        // fetch fresh data
        const items = await fetchDevto(tag, query)

        // cache the result
        setCache(cacheKey, items)

        return Response.json({ items })
    } catch (error) {
        console.error('Dev.to API error:', error)
        return Response.json(
            { items: [] },
            { headers: { 'x-dd-error': 'true' } }
        )
    }
}
