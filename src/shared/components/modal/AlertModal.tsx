/**
 * AlertModal Component - Simple alert dialog for notifications
 */

import React from 'react'
import { Modal, ModalProps } from './Modal'

export interface AlertModalProps extends Omit<ModalProps, 'children'> {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  buttonText?: string
  onAction?: () => void
}

const iconMap = {
  info: (
    <svg
      className="h-6 w-6 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  success: (
    <svg
      className="h-6 w-6 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="h-6 w-6 text-yellow-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-6 w-6 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

const colorMap = {
  info: 'bg-blue-600 hover:bg-blue-700',
  success: 'bg-green-600 hover:bg-green-700',
  warning: 'bg-yellow-600 hover:bg-yellow-700',
  error: 'bg-red-600 hover:bg-red-700',
}

export const AlertModal: React.FC<AlertModalProps> = ({
  message,
  type = 'info',
  buttonText = 'OK',
  onAction,
  ...modalProps
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction()
    }
    modalProps.onClose()
  }

  return (
    <Modal {...modalProps} size="sm" showCloseButton={false}>
      <div className="mb-6 flex items-start space-x-4">
        <div className="flex-shrink-0">{iconMap[type]}</div>
        <p className="text-gray-700">{message}</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAction}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${colorMap[type]}`}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  )
}

export default AlertModal

