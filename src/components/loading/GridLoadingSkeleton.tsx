export function GridLoadingSkeleton({ 
  items = 6, 
  columns = 3 
}: { 
  items?: number; 
  columns?: number;
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] || 'grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-6 animate-pulse`}>
      {[...Array(items)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

