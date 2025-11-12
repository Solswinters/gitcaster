export function ListLoadingSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

