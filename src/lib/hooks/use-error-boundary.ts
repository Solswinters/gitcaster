import { useCallback, useState } from 'react';

/**
 * Hook to manually trigger error boundary
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const showBoundary = useCallback((err: Error | string) => {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    setError(errorObj);
    // This will trigger the nearest error boundary
    throw errorObj;
  }, []);

  const resetBoundary = useCallback(() => {
    setError(null);
  }, []);

  return {
    showBoundary,
    resetBoundary,
    error,
  };
}

