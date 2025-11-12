import { useState, useEffect } from 'react';

/**
 * Hook to track image loading state
 */
export function useImageLoading(src: string): {
  loading: boolean;
  error: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setLoading(false);
    };

    img.onerror = () => {
      setLoading(false);
      setError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loading, error };
}

