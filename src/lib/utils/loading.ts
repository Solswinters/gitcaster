// Loading state utilities

/**
 * Simulate async loading delay for demo purposes
 */
export async function simulateLoading(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrap async function with loading state management
 */
export async function withLoading<T>(
  fn: () => Promise<T>,
  setLoading: (loading: boolean) => void
): Promise<T> {
  setLoading(true);
  try {
    return await fn();
  } finally {
    setLoading(false);
  }
}

/**
 * Debounced loading state (prevents flicker for fast operations)
 */
export function createLoadingDebounce(delay: number = 300) {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return {
    start: (setLoading: (loading: boolean) => void) => {
      timeoutId = setTimeout(() => setLoading(true), delay);
    },
    stop: (setLoading: (loading: boolean) => void) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      setLoading(false);
    },
  };
}

