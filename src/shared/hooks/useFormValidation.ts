/**
 * Form Validation Hook - Reusable form validation logic
 * Simplifies form handling with built-in validation
 */

import { useState, useCallback, useMemo } from 'react';

export interface ValidationRule<T = any> {
  validate: (value: T, formValues?: any) => boolean;
  message: string;
}

export interface FieldConfig<T = any> {
  initialValue: T;
  rules?: ValidationRule<T>[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FormConfig<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FieldConfig<T[K]>;
  };
  onSubmit: (values: T) => void | Promise<void>;
}

export interface FieldState<T = any> {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  config: FormConfig<T>
) {
  // Initialize form state
  const [formState, setFormState] = useState<FormState<T>>(() => {
    const initialValues = Object.entries(config.fields).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: (field as FieldConfig).initialValue,
      }),
      {} as T
    );

    return {
      values: initialValues,
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isSubmitting: false,
    };
  });

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const fieldConfig = config.fields[name];
      if (!fieldConfig || !fieldConfig.rules) return null;

      for (const rule of fieldConfig.rules) {
        if (!rule.validate(value, formState.values)) {
          return rule.message;
        }
      }

      return null;
    },
    [config.fields, formState.values]
  );

  /**
   * Validate all fields
   */
  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const name in config.fields) {
      const error = validateField(name, formState.values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }

    setFormState((prev) => ({
      ...prev,
      errors: newErrors,
      isValid,
    }));

    return isValid;
  }, [config.fields, formState.values, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (name: keyof T) => (value: any) => {
      setFormState((prev) => {
        const newValues = { ...prev.values, [name]: value };
        const newDirty = { ...prev.dirty, [name]: true };

        const fieldConfig = config.fields[name];
        const shouldValidate = fieldConfig?.validateOnChange !== false;

        let newErrors = prev.errors;
        if (shouldValidate) {
          const error = validateField(name, value);
          newErrors = { ...prev.errors };
          if (error) {
            newErrors[name] = error;
          } else {
            delete newErrors[name];
          }
        }

        const isValid = Object.keys(newErrors).length === 0;

        return {
          ...prev,
          values: newValues,
          dirty: newDirty,
          errors: newErrors,
          isValid,
        };
      });
    },
    [config.fields, validateField]
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setFormState((prev) => {
        const newTouched = { ...prev.touched, [name]: true };

        const fieldConfig = config.fields[name];
        const shouldValidate = fieldConfig?.validateOnBlur !== false;

        let newErrors = prev.errors;
        if (shouldValidate) {
          const error = validateField(name, prev.values[name]);
          newErrors = { ...prev.errors };
          if (error) {
            newErrors[name] = error;
          } else {
            delete newErrors[name];
          }
        }

        const isValid = Object.keys(newErrors).length === 0;

        return {
          ...prev,
          touched: newTouched,
          errors: newErrors,
          isValid,
        };
      });
    },
    [config.fields, validateField]
  );

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const isValid = validateAll();
      if (!isValid) return;

      setFormState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        await config.onSubmit(formState.values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [config, formState.values, validateAll]
  );

  /**
   * Reset form to initial state
   */
  const reset = useCallback(() => {
    const initialValues = Object.entries(config.fields).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: (field as FieldConfig).initialValue,
      }),
      {} as T
    );

    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isSubmitting: false,
    });
  }, [config.fields]);

  /**
   * Set field value programmatically
   */
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      handleChange(name)(value);
    },
    [handleChange]
  );

  /**
   * Set field error programmatically
   */
  const setFieldError = useCallback((name: keyof T, error: string | null) => {
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }

      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    });
  }, []);

  /**
   * Get field props for easy binding
   */
  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: formState.values[name],
      onChange: (e: any) => {
        const value = e?.target ? e.target.value : e;
        handleChange(name)(value);
      },
      onBlur: handleBlur(name),
      error: formState.touched[name] ? formState.errors[name] : undefined,
    }),
    [formState, handleChange, handleBlur]
  );

  /**
   * Check if field has error
   */
  const hasError = useCallback(
    (name: keyof T): boolean => {
      return Boolean(formState.touched[name] && formState.errors[name]);
    },
    [formState.touched, formState.errors]
  );

  /**
   * Check if any field is dirty
   */
  const isDirty = useMemo(() => {
    return Object.values(formState.dirty).some(Boolean);
  }, [formState.dirty]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    dirty: formState.dirty,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    getFieldProps,
    hasError,
    validateField,
    validateAll,
  };
}

export default useFormValidation;

