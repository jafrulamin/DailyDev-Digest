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
  const [loading, setLoading] = useState(true);
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
    async function fetchData() {
      setLoading(true);
      
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('query', searchQuery);
        if (activeSource !== 'all') params.append('source', activeSource);
        if (tag) params.append('tag', tag);
        
        const response = await fetch(`/api/aggregate?${params.toString()}`);
        const data = await response.json();
        
        setItems(data.items || []);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    
    // Use a small timeout to avoid hammering the API on rapid input changes
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
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