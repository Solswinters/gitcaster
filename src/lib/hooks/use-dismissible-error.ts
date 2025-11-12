import { useState, useCallback } from 'react';

/**
 * Hook for managing dismissible errors
 */
export function useDismissibleError(autoDismissMs?: number) {
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const showError = useCallback((message: string) => {
    setError(message);
    setDismissed(false);

    if (autoDismissMs) {
      setTimeout(() => {
        setDismissed(true);
      }, autoDismissMs);
    }
  }, [autoDismissMs]);

  const dismissError = useCallback(() => {
    setDismissed(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setDismissed(false);
  }, []);

  return {
    error,
    showError,
    dismissError,
    clearError,
    isVisible: error !== null && !dismissed,
  };
}

