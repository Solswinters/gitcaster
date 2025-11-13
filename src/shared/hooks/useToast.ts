/**
 * useToast Hook
 * 
 * Hook for managing toast notifications
 */

'use client';

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, message, type, duration };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return show(message, 'success', duration);
  }, [show]);

  const error = useCallback((message: string, duration?: number) => {
    return show(message, 'error', duration);
  }, [show]);

  const warning = useCallback((message: string, duration?: number) => {
    return show(message, 'warning', duration);
  }, [show]);

  const info = useCallback((message: string, duration?: number) => {
    return show(message, 'info', duration);
  }, [show]);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear,
  };
}

