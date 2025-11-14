/**
 * FormField Component
 *
 * Unified form field component with validation
 *
 * @module shared/components/forms/FormField
 */

'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { FormGroup } from './FormGroup';

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';

export interface FormFieldProps {
  type?: FormFieldType;
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  options?: Array<{ label: string; value: string }>;
  rows?: number;
  className?: string;
}

export function FormField({
  type = 'text',
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  helpText,
  disabled = false,
  options = [],
  rows = 4,
  className = '',
}: FormFieldProps) {
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'select':
        return (
          <Select
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );

      default:
        return (
          <Input
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <FormGroup
      label={label}
      error={error}
      required={required}
      helpText={helpText}
      className={className}
    >
      {renderField()}
    </FormGroup>
  );
}

