export default function Filters({ activeSource, onSourceChange, tag, onTagChange }) {
  const sources = [
    { id: 'all', label: 'All Sources' },
    { id: 'hn', label: 'Hacker News' },
    { id: 'devto', label: 'Dev.to' },
    { id: 'reddit', label: 'Reddit' }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {sources.map((source) => (
          <button
            key={source.id}
            className={`px-4 py-2 rounded-md ${
              activeSource === source.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSourceChange(source.id)}
          >
            {source.label}
          </button>
        ))}
      </div>
      
      <div className="mt-3">
        <input
          type="text"
          placeholder="Filter by tag (optional)"
          className="w-full sm:w-64 rounded-md border border-gray-300 px-4 py-2 text-sm"
          value={tag || ''}
          onChange={(e) => onTagChange(e.target.value)}
        />
      </div>
    </div>
  );
}