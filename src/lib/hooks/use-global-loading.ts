import { useState, useEffect } from 'react';
import { loadingManager } from '@/lib/utils/loading-manager';

/**
 * Hook to subscribe to global loading state
 */
export function useGlobalLoading(): boolean {
  const [isLoading, setIsLoading] = useState(loadingManager.isAnyLoading());

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe(setIsLoading);
    return unsubscribe;
  }, []);

  return isLoading;
}

/**
 * Hook to manage a specific loading key
 */
export function useLoadingKey(key: string) {
  const setLoading = (isLoading: boolean) => {
    loadingManager.setLoading(key, isLoading);
  };

  useEffect(() => {
    return () => {
      loadingManager.setLoading(key, false);
    };
  }, [key]);

  return {
    setLoading,
    isLoading: loadingManager.isLoading(key),
  };
}

