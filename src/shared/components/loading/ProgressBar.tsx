/**
 * ProgressBar Component - Linear progress indicator
 */

import React from 'react'

export interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  backgroundColor?: string
  showLabel?: boolean
  className?: string
  animate?: boolean
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'bg-blue-600',
  backgroundColor = 'bg-gray-200',
  showLabel = false,
  className = '',
  animate = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={className}>
      <div className={`${backgroundColor} ${sizeMap[size]} w-full overflow-hidden rounded-full`}>
        <div
          className={`${color} ${sizeMap[size]} ${animate ? 'transition-all duration-300' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600">
          {value} / {max} ({percentage.toFixed(0)}%)
        </div>
      )}
    </div>
  )
}

/**
 * Indeterminate Progress Bar - For unknown duration
 */
export const IndeterminateProgressBar: React.FC<{
  className?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ className = '', color = 'bg-blue-600', size = 'md' }) => {
  return (
    <div className={`${className} w-full overflow-hidden`}>
      <div className={`bg-gray-200 ${sizeMap[size]} w-full overflow-hidden rounded-full`}>
        <div
          className={`${color} ${sizeMap[size]} animate-[progress_1.5s_ease-in-out_infinite]`}
          style={{
            width: '45%',
            transform: 'translateX(-100%)',
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

