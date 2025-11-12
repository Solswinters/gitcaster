import { useEffect } from 'react';
import { errorReporter } from '@/lib/utils/error-reporting';

/**
 * Hook to set up global error handlers
 */
export function useGlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      errorReporter.report(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        { type: 'unhandled-rejection' }
      );
      // Prevent default browser behavior
      event.preventDefault();
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      errorReporter.report(event.error, { type: 'global-error' });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
}

