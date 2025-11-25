import { WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface NetworkErrorProps {
  onRetry?: () => void;
}

/**
 * NetworkError utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of NetworkError.
 */
export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <WifiOff className="h-12 w-12 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Network Connection Error
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Unable to connect to the server. Please check your internet connection and try again.
      </p>
      {onRetry && (
        <Button onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
}

