/**
 * Chip Component - Small labeled element
 */

import React from 'react'

export interface ChipProps {
  label: string
  onDelete?: () => void
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  className?: string
}

const colorClasses = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onDelete,
  color = 'default',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${colorClasses[color]} ${sizeClasses[size]} ${className}
      `}
    >
      {label}
      {onDelete && (
        <button
          onClick={onDelete}
          className="hover:opacity-70"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

export default Chip

