export function ContentLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        ))}
      </div>

      {/* Image placeholder */}
      <div className="h-64 bg-gray-200 rounded-lg"></div>

      {/* More content */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

