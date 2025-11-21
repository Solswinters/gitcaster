/**
 * Alert Component - Display contextual feedback messages
 */

import React from 'react'

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  icon?: React.ReactNode
  onClose?: () => void
  className?: string
}

const typeStyles = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-400',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-400',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-400',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-400',
  },
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  icon,
  onClose,
  className = '',
}) => {
  const styles = typeStyles[type]

  return (
    <div
      className={`
        rounded-lg border p-4
        ${styles.bg} ${styles.border} ${styles.text}
        ${className}
      `}
      role="alert"
    >
      <div className="flex">
        {icon && <div className={`flex-shrink-0 ${styles.icon}`}>{icon}</div>}
        <div className={`${icon ? 'ml-3' : ''} flex-1`}>
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 flex-shrink-0 ${styles.text} hover:opacity-75`}
            aria-label="Close alert"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert

