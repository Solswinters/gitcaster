import { ReactNode } from 'react';

import { Loader2 } from 'lucide-react';

interface LoadingPlaceholderProps {
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  children: ReactNode;
}

export function LoadingPlaceholder({
  isLoading,
  isEmpty,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...',
  children,
}: LoadingPlaceholderProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin mb-3" />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}

