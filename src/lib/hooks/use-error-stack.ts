import { useState, useCallback } from 'react';

interface ErrorStackItem {
  message: string;
  timestamp: Date;
  id: string;
}

/**
 * Hook to manage a stack of errors (for showing multiple errors)
 */
export function useErrorStack(maxErrors: number = 5) {
  const [errors, setErrors] = useState<ErrorStackItem[]>([]);

  const addError = useCallback((message: string) => {
    const newError: ErrorStackItem = {
      message,
      timestamp: new Date(),
      id: Math.random().toString(36).substr(2, 9),
    };

    setErrors(prev => {
      const updated = [newError, ...prev];
      return updated.slice(0, maxErrors);
    });
  }, [maxErrors]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(err => err.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    removeError,
    clearAll,
    hasErrors: errors.length > 0,
  };
}

