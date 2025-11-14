/**
 * Form Validation Utilities
 *
 * Comprehensive validation rules and helpers for forms
 *
 * @module shared/components/forms/FormValidation
 */

export interface ValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
}

export class FormValidator {
  static required(message = 'This field is required'): ValidationRule {
    return {
      validate: (value: any) => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined;
      },
      message,
    };
  }

  static email(message = 'Invalid email address'): ValidationRule<string> {
    return {
      validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message,
    };
  }

  static minLength(
    min: number,
    message = `Must be at least ${min} characters`
  ): ValidationRule<string> {
    return {
      validate: (value: string) => value.length >= min,
      message,
    };
  }

  static maxLength(
    max: number,
    message = `Must be at most ${max} characters`
  ): ValidationRule<string> {
    return {
      validate: (value: string) => value.length <= max,
      message,
    };
  }

  static pattern(
    regex: RegExp,
    message = 'Invalid format'
  ): ValidationRule<string> {
    return {
      validate: (value: string) => regex.test(value),
      message,
    };
  }

  static min(
    min: number,
    message = `Must be at least ${min}`
  ): ValidationRule<number> {
    return {
      validate: (value: number) => value >= min,
      message,
    };
  }

  static max(
    max: number,
    message = `Must be at most ${max}`
  ): ValidationRule<number> {
    return {
      validate: (value: number) => value <= max,
      message,
    };
  }

  static url(message = 'Invalid URL'): ValidationRule<string> {
    return {
      validate: (value: string) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message,
    };
  }

  static matches(
    fieldName: string,
    message = `Must match ${fieldName}`
  ): ValidationRule {
    return {
      validate: () => true, // Handled by form-level validation
      message,
    };
  }

  static custom(
    validator: (value: any) => boolean,
    message: string
  ): ValidationRule {
    return {
      validate: validator,
      message,
    };
  }

  static combine(...rules: ValidationRule[]): (value: any) => string | undefined {
    return (value: any) => {
      for (const rule of rules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return undefined;
    };
  }
}

// Commonly used validation schemas
export const commonValidations = {
  email: FormValidator.combine(
    FormValidator.required(),
    FormValidator.email()
  ),
  
  password: FormValidator.combine(
    FormValidator.required(),
    FormValidator.minLength(8, 'Password must be at least 8 characters')
  ),
  
  username: FormValidator.combine(
    FormValidator.required(),
    FormValidator.minLength(3, 'Username must be at least 3 characters'),
    FormValidator.maxLength(39, 'Username must be at most 39 characters'),
    FormValidator.pattern(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
  ),
  
  url: FormValidator.combine(
    FormValidator.required(),
    FormValidator.url()
  ),
};

