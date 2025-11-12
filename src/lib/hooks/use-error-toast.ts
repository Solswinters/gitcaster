import { useState, useCallback } from 'react';
import { formatErrorMessage } from '@/lib/utils/error-formatter';

interface ErrorToastState {
  message: string;
  visible: boolean;
}

/**
 * Hook to manage error toast notifications
 */
export function useErrorToast(duration: number = 5000) {
  const [toast, setToast] = useState<ErrorToastState>({ message: '', visible: false });

  const showError = useCallback((error: unknown) => {
    const message = formatErrorMessage(error);
    setToast({ message, visible: true });

    if (duration > 0) {
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, duration);
    }
  }, [duration]);

  const hideError = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    error: toast,
    showError,
    hideError,
  };
}

