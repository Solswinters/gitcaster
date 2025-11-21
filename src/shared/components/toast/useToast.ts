/**
 * useToast Hook - Hook for showing toast notifications
 */

import { useState, useCallback } from 'react'
import { ToastProps } from './Toast'

let toastId = 0

export interface UseToastReturn {
  toasts: ToastProps[]
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
      const id = `toast-${toastId++}`
      const newToast: ToastProps = {
        ...toast,
        id,
        onClose: removeToast,
      }

      setToasts((prev) => [...prev, newToast])
    },
    [removeToast]
  )

  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'success', title, message, duration })
    },
    [showToast]
  )

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'error', title, message, duration })
    },
    [showToast]
  )

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'warning', title, message, duration })
    },
    [showToast]
  )

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'info', title, message, duration })
    },
    [showToast]
  )

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
  }
}

export default useToast

