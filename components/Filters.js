'use client'

export default function Filters({ source, onSourceChange, tag, onTagChange }) {
  const sources = [
    { value: 'all', label: 'All' },
    { value: 'hn', label: 'Hacker News' },
    { value: 'devto', label: 'Dev.to' },
    { value: 'reddit', label: 'Reddit' },
  ]

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => (
          <button
            key={s.value}
            onClick={() => onSourceChange(s.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              source === s.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Filter by tag (optional)"
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
