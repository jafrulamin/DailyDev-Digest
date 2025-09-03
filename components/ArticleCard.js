import { timeAgo } from '../lib/time';

export default function ArticleCard({ item, onSaveToggle, saved = false }) {
  if (!item) return null;
  
  // Source badge colors
  const sourceBadges = {
    hn: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    devto: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    reddit: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  };
  
  // Format time ago
  const time = timeAgo(item.createdAt);
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-xs px-2 py-1 rounded-full ${sourceBadges[item.source] || 'bg-gray-100 dark:bg-gray-700'}`}>
              {item.source === 'hn' ? 'Hacker News' : 
               item.source === 'devto' ? 'Dev.to' : 
               item.source === 'reddit' ? 'Reddit' : item.source}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{time}</span>
          </div>
          
          <h3 className="text-lg font-medium mb-2">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {item.title}
            </a>
          </h3>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>by {item.author}</span>
            <span className="mx-2">•</span>
            <span>{item.score} points</span>
          </div>
          
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <button
          className={`ml-4 px-3 py-1 rounded-md text-sm ${
            saved
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50'
          }`}
          onClick={() => onSaveToggle(item)}
        >
          {saved ? 'Unsave' : 'Save'}
        </button>
      </div>
    </div>
  );
}