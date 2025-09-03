export default function EmptyState({ message, icon = '📭' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
      <p className="text-gray-500 max-w-md">
        {message || "We couldn't find any articles matching your criteria. Try adjusting your filters or search terms."}
      </p>
    </div>
  );
}