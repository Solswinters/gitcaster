/**
 * TextArea Component - Reusable textarea field with validation
 */

import React, { forwardRef } from 'react'

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
  maxLength?: number
  containerClassName?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount,
      maxLength,
      containerClassName = '',
      className = '',
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const textareaClasses = `
    w-full rounded-lg border px-4 py-2 text-sm transition-colors resize-y
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
    ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
    focus:outline-none focus:ring-2
    ${className}
  `.trim()

    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          {...props}
        />

        <div className="mt-1 flex items-center justify-between">
          <div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
          </div>

          {showCharCount && maxLength && (
            <p className="text-sm text-gray-500">
              {currentLength} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea

