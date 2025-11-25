import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface FallbackUIProps {
  error?: Error;
  resetError?: () => void;
}

export function FallbackUI({ error, resetError }: FallbackUIProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>
          {error && process.env.NODE_ENV === 'development' && (
            <pre className="text-left text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-h-32 mb-4">
              {error.message}
            </pre>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          {resetError && (
            <Button onClick={resetError} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Link href="/">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

