import { Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface TimeoutErrorProps {
  onRetry?: () => void;
  message?: string;
}

export function TimeoutError({ 
  onRetry,
  message = 'The request took too long to complete.' 
}: TimeoutErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-orange-100 p-4 mb-4">
        <Clock className="h-12 w-12 text-orange-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Request Timeout
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

