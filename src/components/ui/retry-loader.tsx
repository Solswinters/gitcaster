import { ReactNode } from 'react';

import { RefreshCw } from 'lucide-react';

import { Button } from './button';

interface RetryLoaderProps {
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  children: ReactNode;
  loadingMessage?: string;
}

export function RetryLoader({
  isLoading,
  error,
  onRetry,
  children,
  loadingMessage = 'Loading...',
}: RetryLoaderProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">Error: {error.message}</p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

