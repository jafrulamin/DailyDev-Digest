// Normalize data from different sources to a common shape

export function normalizeHN(item) {
  if (!item) return null;
  
  return {
    id: `hn-${item.objectID || item.id || Date.now()}`,
    title: item.title || 'Untitled HN Story',
    url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
    source: 'hn',
    author: item.author || 'anonymous',
    score: item.points || 0,
    tags: [],
    createdAt: item.created_at_i ? item.created_at_i * 1000 : Date.now(),
    commentCount: item.num_comments || 0,
  };
}

export function normalizeDevto(item) {
  if (!item) return null;
  
  return {
    id: `devto-${item.id || Date.now()}`,
    title: item.title || 'Untitled Dev.to Article',
    url: item.url || item.canonical_url || `https://dev.to/${item.path}`,
    source: 'devto',
    author: item.user?.username || item.user?.name || 'unknown',
    score: item.public_reactions_count || item.positive_reactions_count || 0,
    tags: Array.isArray(item.tag_list) ? item.tag_list : 
          (typeof item.tag_list === 'string' ? item.tag_list.split(',') : []),
    createdAt: item.published_at ? new Date(item.published_at).getTime() : Date.now(),
    commentCount: item.comments_count || 0,
  };
}

export function normalizeReddit(item) {
  if (!item || !item.data) return null;
  
  const data = item.data;
  return {
    id: `reddit-${data.id || Date.now()}`,
    title: data.title || 'Untitled Reddit Post',
    url: data.url || `https://reddit.com${data.permalink}`,
    source: 'reddit',
    author: data.author || 'unknown',
    score: data.score || 0,
    tags: data.link_flair_text ? [data.link_flair_text] : [],
    createdAt: data.created_utc ? data.created_utc * 1000 : Date.now(),
    commentCount: data.num_comments || 0,
  };
}