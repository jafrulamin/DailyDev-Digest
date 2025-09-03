// Fetchers for different sources

export async function fetchHN(query = '') {
  try {
    const url = new URL('https://hn.algolia.com/api/v1/search_by_date');
    url.searchParams.append('tags', 'story');
    if (query) {
      url.searchParams.append('query', query);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error('Error fetching from HN:', error);
    return [];
  }
}

export async function fetchDevto(tag = '', query = '') {
  try {
    const url = new URL('https://dev.to/api/articles');
    url.searchParams.append('per_page', '30');
    
    if (tag) {
      url.searchParams.append('tag', tag);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    // Handle query filtering client-side if needed
    if (query) {
      return data.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from Dev.to:', error);
    return [];
  }
}

export async function fetchReddit(query = '') {
  try {
    // Fetch from r/programming by default
    const subreddit = 'programming';
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=30`;
    
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const posts = data.data.children || [];
    
    // Handle query filtering client-side
    if (query) {
      return posts.filter(post => 
        post.data.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching from Reddit:', error);
    return [];
  }
}