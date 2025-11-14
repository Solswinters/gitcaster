/**
 * FormGroup Component
 *
 * Container for form fields with label and error display
 *
 * @module shared/components/forms/FormGroup
 */

'use client';

import React from 'react';

export interface FormGroupProps {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({
  label,
  error,
  required = false,
  helpText,
  children,
  className = '',
}: FormGroupProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

