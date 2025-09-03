// Normalize data from different sources to a common format

export function normalizeHN(item) {
  return {
    id: `hn-${item.objectID}`,
    title: item.title,
    url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
    source: 'hn',
    author: item.author || 'unknown',
    score: item.points || 0,
    tags: [],
    createdAt: item.created_at_i ? item.created_at_i * 1000 : Date.now(),
  };
}

export function normalizeDevto(item) {
  return {
    id: `devto-${item.id}`,
    title: item.title,
    url: item.url || item.canonical_url,
    source: 'devto',
    author: item.user?.username || 'unknown',
    score: item.public_reactions_count || 0,
    tags: item.tag_list || [],
    createdAt: new Date(item.published_at).getTime(),
  };
}

export function normalizeReddit(item) {
  const data = item.data;
  return {
    id: `reddit-${data.id}`,
    title: data.title,
    url: data.url || `https://reddit.com${data.permalink}`,
    source: 'reddit',
    author: data.author || 'unknown',
    score: data.score || 0,
    tags: data.link_flair_text ? [data.link_flair_text] : [],
    createdAt: data.created_utc ? data.created_utc * 1000 : Date.now(),
  };
}