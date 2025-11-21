/**
 * ToastContainer Component - Container for toast notifications
 */

import React from 'react'
import { Toast, ToastProps } from './Toast'

export interface ToastContainerProps {
  toasts: ToastProps[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
}

const positionClasses = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
}) => {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      className={`
        pointer-events-none fixed z-50 p-4
        ${positionClasses[position]}
        flex flex-col gap-2
      `}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export default ToastContainer

