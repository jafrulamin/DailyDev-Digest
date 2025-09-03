import Link from 'next/link';

export default function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600 flex items-center">
              <span className="mr-2">📰</span>
              DailyDev Digest
            </Link>
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md">
              Feed
            </Link>
            <Link href="/saved" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md">
              Saved
            </Link>
            <Link href="/digest" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md">
              Digest
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}