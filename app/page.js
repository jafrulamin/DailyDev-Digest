'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Filters from '../components/Filters';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState('all');
  const [tag, setTag] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState({});
  
  // Load saved items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dailydev:saved');
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved items:', err);
        localStorage.removeItem('dailydev:saved');
      }
    }
  }, []);
  
  // Save items to localStorage whenever savedItems changes
  useEffect(() => {
    localStorage.setItem('dailydev:saved', JSON.stringify(savedItems));
  }, [savedItems]);
  
  // Fetch data when filters change
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('query', searchQuery);
        if (activeSource !== 'all') params.append('source', activeSource);
        if (tag) params.append('tag', tag);
        
        console.log('Fetching with params:', params.toString());
        
        const response = await fetch(`/api/aggregate?${params.toString()}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!ignore) {
          console.log(`Received ${data.items?.length || 0} items`);
          setItems(data.items || []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to fetch articles:', error);
          setError(error.message);
          setItems([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    
    // Use a small timeout to avoid hammering the API on rapid input changes
    const timeoutId = setTimeout(fetchData, 300);
    
    return () => {
      clearTimeout(timeoutId);
      ignore = true;
      controller.abort();
    };
  }, [searchQuery, activeSource, tag]);
  
  // Handle saving/unsaving items
  function handleSaveToggle(item) {
    setSavedItems(prev => {
      // If already saved, remove it
      if (prev[item.id]) {
        const newSaved = { ...prev };
        delete newSaved[item.id];
        return newSaved;
      }
      
      // Otherwise add it
      return {
        ...prev,
        [item.id]: item
      };
    });
  }
  
  return (
    <>
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Filters 
          activeSource={activeSource}
          onSourceChange={setActiveSource}
          tag={tag}
          onTagChange={setTag}
        />
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-gray-500">Loading articles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">Error loading articles: {error}</p>
            <p className="text-red-600 text-sm mt-2">Try refreshing or changing your search terms.</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map(item => (
              <ArticleCard 
                key={item.id} 
                item={item} 
                onSaveToggle={handleSaveToggle}
                saved={!!savedItems[item.id]}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No articles found. Try changing your search or filters." />
        )}
      </div>
    </>
  );
}