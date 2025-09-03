// This is a server-side proxy for fetching Reddit data to bypass CORS issues
// No imports needed from lib files

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  
  try {
    // We use multiple subreddits for a better variety of programming content
    const subreddits = ['programming', 'webdev', 'javascript'];
    const promises = subreddits.map(sub => fetchSubreddit(sub));
    
    // Wait for all subreddit requests to complete
    const results = await Promise.all(promises);
    
    // Merge all results
    let allPosts = results.flat();
    
    // Filter by query if provided
    if (query) {
      allPosts = allPosts.filter(post => 
        post.data.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Limit results to avoid huge responses
    allPosts = allPosts.slice(0, 30);
    
    return Response.json({ posts: allPosts });
  } catch (error) {
    console.error('Reddit proxy error:', error);
    return Response.json({ posts: [] }, { status: 500 });
  }
}

async function fetchSubreddit(subreddit) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=20`;
    
    const response = await fetch(url, {
      headers: {
        // A proper user agent helps avoid Reddit API blocks
        'User-Agent': 'web:dailydev-digest:v1.0 (by /u/anonymous)'
      },
      // Setting a short cache to respect Reddit's rate limits
      cache: 'force-cache',
      next: {
        revalidate: 300 // Revalidate every 5 minutes
      }
    });
    
    if (!response.ok) {
      console.error(`Reddit API error for r/${subreddit}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    return data.data?.children || [];
  } catch (error) {
    console.error(`Error fetching from r/${subreddit}:`, error);
    return [];
  }
}