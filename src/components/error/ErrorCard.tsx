import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ 
  title = 'Something went wrong', 
  message, 
  onRetry 
}: ErrorCardProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <div className="flex flex-col items-center text-center">
        <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
        <p className="text-red-700 mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

