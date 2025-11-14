/**
 * Form Context
 *
 * React Context for sharing form state across components
 *
 * @module shared/components/forms/FormContext
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface FormContextValue<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  setFieldError: (field: keyof T, error: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext<T = any>(): FormContextValue<T> {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context as FormContextValue<T>;
}

export interface FormProviderProps<T = any> {
  value: FormContextValue<T>;
  children: ReactNode;
}

export function FormProvider<T = any>({ value, children }: FormProviderProps<T>) {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// Field-level component that uses form context
export interface FormFieldContextProps {
  name: string;
  label?: string;
  required?: boolean;
  children: (props: {
    value: any;
    error?: string;
    touched?: boolean;
    onChange: (value: any) => void;
    onBlur: () => void;
  }) => ReactNode;
}

export function FormFieldContext({ name, label, required, children }: FormFieldContextProps) {
  const { values, errors, touched, setFieldValue, setFieldTouched } = useFormContext();

  const value = values[name];
  const error = errors[name];
  const isTouched = touched[name];

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children({
        value,
        error: isTouched ? error : undefined,
        touched: isTouched,
        onChange: (newValue) => setFieldValue(name, newValue),
        onBlur: () => setFieldTouched(name, true),
      })}
      {isTouched && error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

