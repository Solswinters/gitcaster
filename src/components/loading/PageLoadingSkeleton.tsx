export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 bg-gray-200 rounded-lg mb-6"></div>
      
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      
      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

