import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loading state for error components
 */
export function ErrorSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

