'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ArticleCard from '../../components/ArticleCard';
import EmptyState from '../../components/EmptyState';

export default function DigestPage() {
  const [topItems, setTopItems] = useState([]);
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
      }
    }
  }, []);
  
  // Save items to localStorage whenever savedItems changes
  useEffect(() => {
    localStorage.setItem('dailydev:saved', JSON.stringify(savedItems));
  }, [savedItems]);
  
  // Fetch data on mount
  useEffect(() => {
    async function fetchDigest() {
      setLoading(true);
      
      try {
        // Fetch recent top items (last 2 days)
        const response = await fetch('/api/aggregate');
        const data = await response.json();
        
        // Sort by score (highest first)
        const sorted = [...(data.items || [])].sort((a, b) => b.score - a.score);
        
        // Take top 10
        setTopItems(sorted.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch digest:', error);
        setTopItems([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDigest();
  }, []);
  
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
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Daily Developer Digest</h1>
          <p className="text-gray-600 mt-2">
            Top 10 trending developer stories from across the web.
            Updated every time you visit.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-gray-500">Preparing your digest...</p>
            </div>
          </div>
        ) : topItems.length > 0 ? (
          <div className="space-y-4">
            {topItems.map(item => (
              <ArticleCard 
                key={item.id} 
                item={item} 
                onSaveToggle={handleSaveToggle}
                saved={!!savedItems[item.id]}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Couldn't load the digest. Please try again later." />
        )}
      </div>
    </>
  );
}