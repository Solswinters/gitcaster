/**
 * StatusBadge Component - Status indicator with icon
 */

import React from 'react'

export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig = {
  online: {
    color: 'bg-green-500',
    label: 'Online',
  },
  offline: {
    color: 'bg-gray-400',
    label: 'Offline',
  },
  away: {
    color: 'bg-yellow-500',
    label: 'Away',
  },
  busy: {
    color: 'bg-red-500',
    label: 'Busy',
  },
}

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showLabel = false,
  size = 'md',
  className = '',
}) => {
  const config = statusConfig[status]

  if (showLabel) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`${sizeClasses[size]} ${config.color} rounded-full`} />
        <span className="text-sm text-gray-700">{config.label}</span>
      </div>
    )
  }

  return <span className={`${sizeClasses[size]} ${config.color} rounded-full ${className}`} />
}

export default StatusBadge

