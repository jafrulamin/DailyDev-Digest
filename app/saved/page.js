'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ArticleCard from '../../components/ArticleCard';
import EmptyState from '../../components/EmptyState';
import { downloadCSV } from '../../lib/csv';

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  
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
  
  // Filter items based on search query
  useEffect(() => {
    const items = Object.values(savedItems);
    
    if (!searchQuery) {
      setFilteredItems(items);
      return;
    }
    
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredItems(filtered);
  }, [savedItems, searchQuery]);
  
  // Handle removing items
  function handleRemoveItem(item) {
    setSavedItems(prev => {
      const newSaved = { ...prev };
      delete newSaved[item.id];
      
      // Update localStorage
      localStorage.setItem('dailydev:saved', JSON.stringify(newSaved));
      
      return newSaved;
    });
  }
  
  // Handle exporting to CSV
  function handleExport() {
    const items = Object.values(savedItems);
    if (items.length === 0) {
      alert('No saved items to export');
      return;
    }
    
    downloadCSV(items);
  }
  
  return (
    <>
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Saved Articles</h1>
          <button
            onClick={handleExport}
            disabled={Object.keys(savedItems).length === 0}
            className={`px-4 py-2 rounded-md ${
              Object.keys(savedItems).length === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            Export to CSV
          </button>
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <ArticleCard 
                key={item.id} 
                item={item} 
                onSaveToggle={handleRemoveItem}
                saved={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            message={
              Object.keys(savedItems).length === 0
                ? "You haven't saved any articles yet. Browse the feed and save articles you find interesting."
                : "No saved articles match your search."
            }
            icon="🔖"
          />
        )}
      </div>
    </>
  );
}