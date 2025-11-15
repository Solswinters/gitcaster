/**
 * Domain Validators
 * 
 * Business rule validators and validation logic.
 */

export * from './user.validator';
export * from './github.validator';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(r => r.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Create a success validation result
 */
export function validationSuccess(): ValidationResult {
  return { isValid: true, errors: [] };
}

/**
 * Create a failure validation result
 */
export function validationFailure(errors: string | string[]): ValidationResult {
  return {
    isValid: false,
    errors: Array.isArray(errors) ? errors : [errors],
  };
}
