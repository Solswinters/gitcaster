import { useState, useEffect } from 'react';

/**
 * Hook that throws a promise for React Suspense
 * WARNING: This is an advanced pattern - use with Suspense boundary
 */
export function useSuspenseQuery<T>(
  queryFn: () => Promise<T>,
  key: string
): T {
  const [data, setData] = useState<T | null>(null);
  const [promise, setPromise] = useState<Promise<T> | null>(null);

  useEffect(() => {
    if (data !== null) return;

    const fetchData = queryFn().then((result) => {
      setData(result);
      setPromise(null);
      return result;
    });

    setPromise(fetchData);
  }, [queryFn, data]);

  if (promise) {
    throw promise;
  }

  if (data === null) {
    throw new Error('No data and no promise - should not happen');
  }

  return data;
}

