/**
 * ConfirmModal Component - Confirmation dialog for important actions
 */

import React from 'react'
import { Modal, ModalProps } from './Modal'

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  confirmButtonColor?: 'primary' | 'danger' | 'success' | 'warning'
  isLoading?: boolean
}

const buttonColorMap = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonColor = 'primary',
  isLoading = false,
  ...modalProps
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      modalProps.onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    modalProps.onClose()
  }

  return (
    <Modal {...modalProps} size="sm">
      <div className="mb-6">
        <p className="text-gray-700">{message}</p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${buttonColorMap[confirmButtonColor]}`}
        >
          {isLoading ? 'Loading...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmModal

