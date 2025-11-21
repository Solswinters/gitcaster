/**
 * Switch Component - Toggle switch for on/off states
 */

import React, { forwardRef } from 'react'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const sizeClasses = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, disabled = false, size = 'md', label, className = '' }, ref) => {
    const sizes = sizeClasses[size]

    return (
      <label className={`inline-flex items-center gap-2 ${className}`}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex flex-shrink-0 ${sizes.track}
            rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block ${sizes.thumb}
              transform rounded-full bg-white shadow ring-0
              transition duration-200 ease-in-out
              ${checked ? sizes.translate : 'translate-x-0'}
            `}
          />
        </button>
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch

