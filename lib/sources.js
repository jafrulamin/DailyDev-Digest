// Fetchers for different sources
// Keep HN and Dev.to fetchers as they were

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

// UPDATED Reddit fetcher with proxy approach
export async function fetchReddit(query = '') {
  try {
    // Reddit has strict CORS and API policies, so we'll use our backend as a proxy
    // We'll make the request from the backend route instead of directly from the client
    
    // Instead of directly calling Reddit's API, we'll use our own API route as a proxy
    // This avoids CORS issues and allows proper header configuration
    const response = await fetch(`/api/sources/reddit/proxy?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      console.error('Reddit proxy API error status:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching from Reddit proxy:', error);
    return [];
  }
}