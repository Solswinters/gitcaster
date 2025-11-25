import { useEffect, useRef } from 'react';
import { ErrorContext } from '@/lib/utils/error-context';
import { errorReporter } from '@/lib/utils/error-reporting';

/**
 * Hook to track error analytics
 */
export function useErrorAnalytics(componentName: string) {
  const errorCount = useRef(0);
  const lastError = useRef<Error | null>(null);

  const trackError = (error: Error, context?: Partial<ErrorContext>) => {
    errorCount.current++;
    lastError.current = error;

    // Report to analytics
    errorReporter.report(error, {
      component: componentName,
      ...context,
    });

    // Track error patterns
    if (errorCount.current > 3) {
      errorReporter.reportMessage(
        `High error rate in ${componentName}: ${errorCount.current} errors`,
        'warning'
      );
    }
  };

  const resetAnalytics = () => {
    errorCount.current = 0;
    lastError.current = null;
  };

  // Reset on unmount
  useEffect(() => {
    return () => resetAnalytics();
  }, []);

  return {
    trackError,
    resetAnalytics,
    errorCount: errorCount.current,
    lastError: lastError.current,
  };
}

