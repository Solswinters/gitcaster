/**
 * Hook for managing multiple loading states
 */

'use client';

import { useState, useCallback } from 'react';

type LoadingStates = Record<string, boolean>;

interface MultipleLoadingState {
  loadingStates: LoadingStates;
  isLoading: (key: string) => boolean;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  toggleLoading: (key: string) => void;
  isAnyLoading: boolean;
  reset: () => void;
}

export function useMultipleLoading(
  initialStates: LoadingStates = {}
): MultipleLoadingState {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialStates);

  const isLoading = useCallback(
    (key: string): boolean => {
      return loadingStates[key] ?? false;
    },
    [loadingStates]
  );

  const startLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }));
  }, []);

  const toggleLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    setLoadingStates({});
  }, []);

  const isAnyLoading = Object.values(loadingStates).some((state) => state);

  return {
    loadingStates,
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    isAnyLoading,
    reset,
  };
}

