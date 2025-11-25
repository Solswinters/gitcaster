/**
 * TableLoadingSkeleton utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TableLoadingSkeleton.
 */
export function TableLoadingSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full animate-pulse">
      {/* Table Header */}
      <div className="flex gap-4 pb-4 mb-4 border-b border-gray-200">
        {[...Array(columns)].map((_, i) => (
          <div key={`header-${i}`} className="flex-1 h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      
      {/* Table Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-3 border-b border-gray-100">
          {[...Array(columns)].map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

