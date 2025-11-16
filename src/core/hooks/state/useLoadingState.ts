/**
 * Hook for managing loading state
 */

'use client';

import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  toggleLoading: () => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

export function useLoadingState(initialState = false): LoadingState {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggleLoading = useCallback(() => {
    setIsLoading((prev) => !prev);
  }, []);

  const withLoading = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await fn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading,
  };
}

