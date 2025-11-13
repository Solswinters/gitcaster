/**
 * Form Validation Utilities
 * 
 * Utilities for validating form data and creating validation schemas
 */

export type ValidationRule<T = any> = {
  validate: (value: T) => boolean;
  message: string;
};

export type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export type ValidationResult<T> = {
  isValid: boolean;
  errors: ValidationErrors<T>;
};

/**
 * Validate a single field against rules
 */
export function validateField<T>(
  value: T,
  rules: ValidationRule<T>[]
): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}

/**
 * Validate an entire form against a schema
 */
export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema<T>
): ValidationResult<T> {
  const errors: ValidationErrors<T> = {};
  let isValid = true;

  for (const key in schema) {
    const rules = schema[key];
    if (rules) {
      const error = validateField(data[key], rules);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
}

/**
 * Common validation rules
 */
export const rules = {
  required: (message = 'This field is required'): ValidationRule<any> => ({
    validate: (value) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value !== null && value !== undefined;
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),

  email: (message = 'Must be a valid email'): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  url: (message = 'Must be a valid URL'): ValidationRule<string> => ({
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  pattern: (
    regex: RegExp,
    message = 'Invalid format'
  ): ValidationRule<string> => ({
    validate: (value) => regex.test(value),
    message,
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value >= min,
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value <= max,
    message: message || `Must be at most ${max}`,
  }),

  integer: (message = 'Must be an integer'): ValidationRule<number> => ({
    validate: (value) => Number.isInteger(value),
    message,
  }),

  positive: (message = 'Must be positive'): ValidationRule<number> => ({
    validate: (value) => value > 0,
    message,
  }),

  oneOf: <T>(
    options: T[],
    message?: string
  ): ValidationRule<T> => ({
    validate: (value) => options.includes(value),
    message: message || `Must be one of: ${options.join(', ')}`,
  }),

  custom: <T>(
    validator: (value: T) => boolean,
    message: string
  ): ValidationRule<T> => ({
    validate: validator,
    message,
  }),

  matches: (otherField: string, message = 'Fields must match'): ValidationRule<any> => ({
    validate: function(this: Record<string, any>, value) {
      return value === this[otherField];
    },
    message,
  }),
};

/**
 * Create a validation schema builder
 */
export class ValidationSchemaBuilder<T extends Record<string, any>> {
  private schema: ValidationSchema<T> = {};

  field<K extends keyof T>(
    fieldName: K,
    ...rules: ValidationRule<T[K]>[]
  ): this {
    this.schema[fieldName] = rules;
    return this;
  }

  build(): ValidationSchema<T> {
    return this.schema;
  }
}

/**
 * Helper to create a schema builder
 */
export function createSchema<T extends Record<string, any>>(): ValidationSchemaBuilder<T> {
  return new ValidationSchemaBuilder<T>();
}

/**
 * Async field validation
 */
export async function validateFieldAsync<T>(
  value: T,
  asyncValidator: (value: T) => Promise<boolean>,
  message: string
): Promise<string | null> {
  const isValid = await asyncValidator(value);
  return isValid ? null : message;
}

/**
 * Debounced validation for real-time form validation
 */
export function createDebouncedValidator<T>(
  validator: (value: T) => ValidationResult<T> | Promise<ValidationResult<T>>,
  delay: number = 300
): (value: T) => Promise<ValidationResult<T>> {
  let timeoutId: NodeJS.Timeout;

  return (value: T) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await validator(value);
        resolve(result);
      }, delay);
    });
  };
}

/**
 * Combine multiple validation schemas
 */
export function mergeSchemas<T extends Record<string, any>>(
  ...schemas: ValidationSchema<T>[]
): ValidationSchema<T> {
  return Object.assign({}, ...schemas);
}

/**
 * Extract first error from validation errors
 */
export function getFirstError<T>(errors: ValidationErrors<T>): string | null {
  const firstKey = Object.keys(errors)[0] as keyof T;
  return firstKey ? errors[firstKey] || null : null;
}

/**
 * Check if form has any errors
 */
export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Clear errors for specific fields
 */
export function clearFieldErrors<T>(
  errors: ValidationErrors<T>,
  ...fields: (keyof T)[]
): ValidationErrors<T> {
  const newErrors = { ...errors };
  fields.forEach(field => {
    delete newErrors[field];
  });
  return newErrors;
}

