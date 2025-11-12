import { useCallback } from 'react';
import { useToast } from './use-toast';
import { formatErrorMessage } from '@/lib/utils/error-formatter';

/**
 * Hook for showing error notifications
 */
export function useErrorNotification() {
  const { showToast } = useToast();

  const notifyError = useCallback((
    error: unknown,
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    const message = formatErrorMessage(error);
    
    showToast({
      type: 'error',
      title: options?.title || 'Error',
      message,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }, [showToast]);

  const notifyWarning = useCallback((
    message: string,
    options?: {
      title?: string;
      duration?: number;
    }
  ) => {
    showToast({
      type: 'warning',
      title: options?.title || 'Warning',
      message,
      duration: options?.duration || 4000,
    });
  }, [showToast]);

  return {
    notifyError,
    notifyWarning,
  };
}

