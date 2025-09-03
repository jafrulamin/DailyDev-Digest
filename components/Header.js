import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400 flex items-center">
              <span className="mr-2">📰</span>
              DailyDev Digest
            </Link>
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md">
                Feed
              </Link>
              <Link href="/saved" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md">
                Saved
              </Link>
              <Link href="/digest" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md">
                Digest
              </Link>
            </nav>
            
            {/* Theme toggle button */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}