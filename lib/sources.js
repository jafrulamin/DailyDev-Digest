import { normalizeHN, normalizeDevto, normalizeReddit } from './normalize'

// fetch from Hacker News Algolia API
export async function fetchHN(query = '') {
    try {
        const url = query
            ? `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=50`
            : 'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=50'

        const response = await fetch(url)
        const data = await response.json()

        return data.hits.map(normalizeHN)
    } catch (error) {
        console.error('Error fetching HN:', error)
        return []
    }
}

// fetch from Dev.to API
export async function fetchDevto(tag = '', query = '') {
    try {
        let url = 'https://dev.to/api/articles?top=1&per_page=50'

        if (tag) {
            url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=50`
        }

        const response = await fetch(url)
        const data = await response.json()

        let articles = data.map(normalizeDevto)

        // filter by query if provided
        if (query) {
            const searchTerm = query.toLowerCase()
            articles = articles.filter(article =>
                article.title.toLowerCase().includes(searchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            )
        }

        return articles
    } catch (error) {
        console.error('Error fetching Dev.to:', error)
        return []
    }
}

// fetch from Reddit programming subs
export async function fetchReddit(query = '') {
    try {
        const subreddits = ['programming', 'webdev', 'javascript', 'reactjs', 'node']
        const url = `https://www.reddit.com/r/${subreddits.join('+')}/hot.json?limit=50`

        const response = await fetch(url)
        const data = await response.json()

        let posts = data.data.children.map(normalizeReddit)

        // filter by query if provided
        if (query) {
            const searchTerm = query.toLowerCase()
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            )
        }

        return posts
    } catch (error) {
        console.error('Error fetching Reddit:', error)
        return []
    }
}
