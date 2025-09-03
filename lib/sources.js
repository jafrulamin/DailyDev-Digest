// Fetchers for different sources

export async function fetchHN(query = '') {
  try {
    // Use the official HN Algolia API
    const url = new URL('https://hn.algolia.com/api/v1/search');
    url.searchParams.append('tags', 'story');
    if (query) {
      url.searchParams.append('query', query);
    }
    // Add a sort param and higher results count
    url.searchParams.append('hitsPerPage', '30');
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('HN API error status:', response.status);
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
    // Use Dev.to API - note they have rate limits
    const url = new URL('https://dev.to/api/articles');
    
    // Add important query params
    url.searchParams.append('per_page', '30');
    
    if (tag) {
      url.searchParams.append('tag', tag);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Dev.to API error status:', response.status);
      return [];
    }
    
    let data = await response.json();
    
    // Handle query filtering client-side if needed
    if (query) {
      data = data.filter(item => 
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
    // Use Reddit's JSON API - no auth needed for public subreddits
    const subreddit = 'programming';
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=30`;
    
    const response = await fetch(url, {
      headers: {
        // Add a user agent to avoid Reddit API blocks
        'User-Agent': 'web:dailydev-digest:v1.0 (by /u/anonymous)'
      }
    });
    
    if (!response.ok) {
      console.error('Reddit API error status:', response.status);
      return [];
    }
    
    const data = await response.json();
    let posts = data.data?.children || [];
    
    // Handle query filtering client-side
    if (query) {
      posts = posts.filter(post => 
        post.data.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching from Reddit:', error);
    return [];
  }
}