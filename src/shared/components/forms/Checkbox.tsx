/**
 * Checkbox Component - Reusable checkbox with label
 */

import React, { forwardRef } from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, containerClassName = '', className = '', ...props }, ref) => {
    const checkboxClasses = `
    h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    ${className}
  `.trim()

    return (
      <div className={containerClassName}>
        <div className="flex items-start">
          <input ref={ref} type="checkbox" className={checkboxClasses} {...props} />
          {label && (
            <label
              htmlFor={props.id}
              className="ml-2 cursor-pointer select-none text-sm text-gray-700"
            >
              {label}
            </label>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox

