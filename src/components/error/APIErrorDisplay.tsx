import { Server } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface APIErrorDisplayProps {
  statusCode?: number;
  message: string;
  onRetry?: () => void;
}

/**
 * APIErrorDisplay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of APIErrorDisplay.
 */
export function APIErrorDisplay({ statusCode, message, onRetry }: APIErrorDisplayProps) {
  const getTitle = () => {
    if (statusCode === 401) return 'Unauthorized';
    if (statusCode === 403) return 'Access Denied';
    if (statusCode === 404) return 'Not Found';
    if (statusCode && statusCode >= 500) return 'Server Error';
    return 'API Error';
  };

  const getDescription = () => {
    if (statusCode === 401) return 'Please sign in to continue.';
    if (statusCode === 403) return 'You don\'t have permission to access this resource.';
    if (statusCode === 404) return 'The requested resource could not be found.';
    if (statusCode && statusCode >= 500) return 'Our servers encountered an error. Please try again later.';
    return message;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <Server className="h-12 w-12 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {getTitle()} {statusCode && `(${statusCode})`}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {getDescription()}
      </p>
      {onRetry && statusCode && statusCode >= 500 && (
        <Button onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

