'use client'

import { timeAgo } from '../lib/time'

export default function ArticleCard({ item, onSaveToggle, saved }) {
  const handleSaveToggle = () => {
    onSaveToggle(item)
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
              {item.source}
            </span>
            {item.score && (
              <span className="text-xs text-gray-500">★ {item.score}</span>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-blue-600"
            >
              {item.title}
            </a>
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            {item.author && <span>by {item.author}</span>}
            <span>{timeAgo(item.createdAt)}</span>
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSaveToggle}
          className={`ml-4 px-3 py-1 rounded text-sm font-medium ${
            saved
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {saved ? 'Unsave' : 'Save'}
        </button>
      </div>
    </article>
  )
}
