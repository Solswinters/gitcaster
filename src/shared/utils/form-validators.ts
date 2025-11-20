/**
 * Form Validation Utilities - Comprehensive validation functions for forms
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ValidationRule {
  validator: (value: any) => ValidationResult
  message?: string
}

export type FieldValidator = (value: any) => ValidationResult

/**
 * Required field validator
 */
export const required = (message: string = 'This field is required'): FieldValidator => {
  return (value: any): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: message }
    }
    if (typeof value === 'string' && value.trim() === '') {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Minimum length validator
 */
export const minLength = (min: number, message?: string): FieldValidator => {
  return (value: any): ValidationResult => {
    const length = value?.toString().length || 0
    if (length < min) {
      return {
        isValid: false,
        error: message || `Must be at least ${min} characters`,
      }
    }
    return { isValid: true }
  }
}

/**
 * Maximum length validator
 */
export const maxLength = (max: number, message?: string): FieldValidator => {
  return (value: any): ValidationResult => {
    const length = value?.toString().length || 0
    if (length > max) {
      return {
        isValid: false,
        error: message || `Must be no more than ${max} characters`,
      }
    }
    return { isValid: true }
  }
}

/**
 * Email validator
 */
export const email = (message: string = 'Invalid email address'): FieldValidator => {
  return (value: any): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * URL validator
 */
export const url = (message: string = 'Invalid URL'): FieldValidator => {
  return (value: any): ValidationResult => {
    try {
      new URL(value)
      return { isValid: true }
    } catch {
      return { isValid: false, error: message }
    }
  }
}

/**
 * Pattern (regex) validator
 */
export const pattern = (regex: RegExp, message: string = 'Invalid format'): FieldValidator => {
  return (value: any): ValidationResult => {
    if (!regex.test(value)) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Number validator
 */
export const number = (message: string = 'Must be a number'): FieldValidator => {
  return (value: any): ValidationResult => {
    if (isNaN(Number(value))) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Integer validator
 */
export const integer = (message: string = 'Must be an integer'): FieldValidator => {
  return (value: any): ValidationResult => {
    if (!Number.isInteger(Number(value))) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Minimum value validator
 */
export const min = (minValue: number, message?: string): FieldValidator => {
  return (value: any): ValidationResult => {
    if (Number(value) < minValue) {
      return {
        isValid: false,
        error: message || `Must be at least ${minValue}`,
      }
    }
    return { isValid: true }
  }
}

/**
 * Maximum value validator
 */
export const max = (maxValue: number, message?: string): FieldValidator => {
  return (value: any): ValidationResult => {
    if (Number(value) > maxValue) {
      return {
        isValid: false,
        error: message || `Must be no more than ${maxValue}`,
      }
    }
    return { isValid: true }
  }
}

/**
 * Range validator
 */
export const range = (minValue: number, maxValue: number, message?: string): FieldValidator => {
  return (value: any): ValidationResult => {
    const num = Number(value)
    if (num < minValue || num > maxValue) {
      return {
        isValid: false,
        error: message || `Must be between ${minValue} and ${maxValue}`,
      }
    }
    return { isValid: true }
  }
}

/**
 * Ethereum address validator
 */
export const ethereumAddress = (message: string = 'Invalid Ethereum address'): FieldValidator => {
  return (value: any): ValidationResult => {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/
    if (!addressRegex.test(value)) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * GitHub username validator
 */
export const githubUsername = (message: string = 'Invalid GitHub username'): FieldValidator => {
  return (value: any): ValidationResult => {
    const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
    if (!usernameRegex.test(value)) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Username validator (alphanumeric with underscores and hyphens)
 */
export const username = (message: string = 'Invalid username'): FieldValidator => {
  return (value: any): ValidationResult => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(value)) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Password strength validator
 */
export const passwordStrength = (
  options: {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSpecialChars?: boolean
  } = {},
  message?: string
): FieldValidator => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options

  return (value: any): ValidationResult => {
    const errors: string[] = []

    if (value.length < minLength) {
      errors.push(`at least ${minLength} characters`)
    }
    if (requireUppercase && !/[A-Z]/.test(value)) {
      errors.push('one uppercase letter')
    }
    if (requireLowercase && !/[a-z]/.test(value)) {
      errors.push('one lowercase letter')
    }
    if (requireNumbers && !/\d/.test(value)) {
      errors.push('one number')
    }
    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('one special character')
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        error: message || `Password must contain ${errors.join(', ')}`,
      }
    }

    return { isValid: true }
  }
}

/**
 * Match validator (for password confirmation)
 */
export const match = (otherValue: any, fieldName: string = 'field'): FieldValidator => {
  return (value: any): ValidationResult => {
    if (value !== otherValue) {
      return {
        isValid: false,
        error: `Does not match ${fieldName}`,
      }
    }
    return { isValid: true }
  }
}

/**
 * Date validator
 */
export const date = (message: string = 'Invalid date'): FieldValidator => {
  return (value: any): ValidationResult => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Future date validator
 */
export const futureDate = (message: string = 'Date must be in the future'): FieldValidator => {
  return (value: any): ValidationResult => {
    const date = new Date(value)
    if (date <= new Date()) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Past date validator
 */
export const pastDate = (message: string = 'Date must be in the past'): FieldValidator => {
  return (value: any): ValidationResult => {
    const date = new Date(value)
    if (date >= new Date()) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * File size validator
 */
export const fileSize = (maxSize: number, message?: string): FieldValidator => {
  return (value: File | FileList): ValidationResult => {
    const file = value instanceof FileList ? value[0] : value
    if (file && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
      return {
        isValid: false,
        error: message || `File size must be less than ${maxSizeMB}MB`,
      }
    }
    return { isValid: true }
  }
}

/**
 * File type validator
 */
export const fileType = (allowedTypes: string[], message?: string): FieldValidator => {
  return (value: File | FileList): ValidationResult => {
    const file = value instanceof FileList ? value[0] : value
    if (file && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: message || `File type must be one of: ${allowedTypes.join(', ')}`,
      }
    }
    return { isValid: true }
  }
}

/**
 * Array length validator
 */
export const arrayLength = (minLength: number, maxLength?: number): FieldValidator => {
  return (value: any[]): ValidationResult => {
    if (!Array.isArray(value)) {
      return { isValid: false, error: 'Must be an array' }
    }

    if (value.length < minLength) {
      return {
        isValid: false,
        error: `Must have at least ${minLength} items`,
      }
    }

    if (maxLength !== undefined && value.length > maxLength) {
      return {
        isValid: false,
        error: `Must have no more than ${maxLength} items`,
      }
    }

    return { isValid: true }
  }
}

/**
 * Phone number validator (simple US format)
 */
export const phoneNumber = (message: string = 'Invalid phone number'): FieldValidator => {
  return (value: any): ValidationResult => {
    const phoneRegex = /^\+?[\d\s()-]{10,}$/
    if (!phoneRegex.test(value)) {
      return { isValid: false, error: message }
    }
    return { isValid: true }
  }
}

/**
 * Credit card number validator (Luhn algorithm)
 */
export const creditCard = (message: string = 'Invalid credit card number'): FieldValidator => {
  return (value: any): ValidationResult => {
    const cardNumber = value.replace(/\s/g, '')
    
    if (!/^\d+$/.test(cardNumber)) {
      return { isValid: false, error: message }
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    if (sum % 10 !== 0) {
      return { isValid: false, error: message }
    }

    return { isValid: true }
  }
}

/**
 * Compose multiple validators
 */
export const compose = (...validators: FieldValidator[]): FieldValidator => {
  return (value: any): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value)
      if (!result.isValid) {
        return result
      }
    }
    return { isValid: true }
  }
}

/**
 * Conditional validator
 */
export const when = (
  condition: (value: any) => boolean,
  validator: FieldValidator
): FieldValidator => {
  return (value: any): ValidationResult => {
    if (condition(value)) {
      return validator(value)
    }
    return { isValid: true }
  }
}

/**
 * Validate entire form
 */
export const validateForm = (
  values: Record<string, any>,
  rules: Record<string, FieldValidator | FieldValidator[]>
): Record<string, string> => {
  const errors: Record<string, string> = {}

  Object.keys(rules).forEach((field) => {
    const value = values[field]
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]]

    for (const rule of fieldRules as FieldValidator[]) {
      const result = rule(value)
      if (!result.isValid) {
        errors[field] = result.error || 'Invalid value'
        break
      }
    }
  })

  return errors
}

/**
 * Check if form has errors
 */
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0
}

/**
 * Get first error message
 */
export const getFirstError = (errors: Record<string, string>): string | null => {
  const keys = Object.keys(errors)
  return keys.length > 0 ? errors[keys[0]] : null
}

export default {
  required,
  minLength,
  maxLength,
  email,
  url,
  pattern,
  number,
  integer,
  min,
  max,
  range,
  ethereumAddress,
  githubUsername,
  username,
  passwordStrength,
  match,
  date,
  futureDate,
  pastDate,
  fileSize,
  fileType,
  arrayLength,
  phoneNumber,
  creditCard,
  compose,
  when,
  validateForm,
  hasErrors,
  getFirstError,
}

