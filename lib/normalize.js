// normalize data from different sources to common shape
export function normalizeHN(item) {
  return {
    id: item.objectID,
    title: item.title,
    url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
    source: 'hn',
    author: item.author,
    score: item.points,
    tags: [],
    createdAt: item.created_at_i * 1000
  }
}

export function normalizeDevto(item) {
  return {
    id: item.id.toString(),
    title: item.title,
    url: item.url,
    source: 'devto',
    author: item.user?.username,
    score: item.public_reactions_count,
    tags: item.tag_list || [],
    createdAt: new Date(item.published_at).getTime()
  }
}

export function normalizeReddit(item) {
  return {
    id: item.data.id,
    title: item.data.title,
    url: `https://reddit.com${item.data.permalink}`,
    source: 'reddit',
    author: item.data.author,
    score: item.data.score,
    tags: item.data.link_flair_text ? [item.data.link_flair_text] : [],
    createdAt: item.data.created_utc * 1000
  }
}
