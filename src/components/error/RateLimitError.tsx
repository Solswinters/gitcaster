import { Hourglass } from 'lucide-react';

interface RateLimitErrorProps {
  retryAfter?: number; // seconds
  message?: string;
}

/**
 * RateLimitError utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of RateLimitError.
 */
export function RateLimitError({ 
  retryAfter,
  message = 'Too many requests. Please wait before trying again.'
}: RateLimitErrorProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-yellow-100 p-4 mb-4">
        <Hourglass className="h-12 w-12 text-yellow-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Rate Limit Exceeded
      </h3>
      <p className="text-gray-600 text-center mb-2 max-w-md">
        {message}
      </p>
      {retryAfter && (
        <p className="text-sm text-gray-500">
          Please wait {formatTime(retryAfter)} before trying again.
        </p>
      )}
    </div>
  );
}

