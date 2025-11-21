/**
 * DotBadge Component - Notification dot indicator
 */

import React from 'react'

export interface DotBadgeProps {
  count?: number
  max?: number
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  showZero?: boolean
  dot?: boolean
  className?: string
  children?: React.ReactNode
}

const variantClasses = {
  primary: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-600 text-white',
  danger: 'bg-red-600 text-white',
}

export const DotBadge: React.FC<DotBadgeProps> = ({
  count = 0,
  max = 99,
  variant = 'danger',
  showZero = false,
  dot = false,
  className = '',
  children,
}) => {
  const shouldShow = count > 0 || showZero

  if (!shouldShow && !dot) {
    return <>{children}</>
  }

  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {shouldShow && (
        <span
          className={`
            absolute -right-1 -top-1 flex items-center justify-center
            ${dot ? 'h-2 w-2' : 'min-w-[1.25rem] h-5 px-1'}
            rounded-full text-xs font-medium
            ${variantClasses[variant]}
          `.trim()}
        >
          {!dot && displayCount}
        </span>
      )}
    </div>
  )
}

export default DotBadge

