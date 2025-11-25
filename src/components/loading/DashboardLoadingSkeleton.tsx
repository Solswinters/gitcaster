/**
 * DashboardLoadingSkeleton utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DashboardLoadingSkeleton.
 */
export function DashboardLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Title */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

