/**
 * Skeleton Component - Content placeholder for loading states
 */

import React from 'react'

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  className?: string
  animate?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animate = true,
}) => {
  const baseClasses = 'bg-gray-200'
  const animateClasses = animate ? 'animate-pulse' : ''

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const style: React.CSSProperties = {}

  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width
  }

  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height
  } else if (variant === 'text') {
    style.height = '1rem'
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animateClasses} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

/**
 * Skeleton Text - Multiple text lines
 */
export interface SkeletonTextProps {
  lines?: number
  className?: string
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} width={index === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  )
}

/**
 * Skeleton Card - Card placeholder
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <SkeletonText lines={3} />
      </div>
    </div>
  )
}

export default Skeleton

