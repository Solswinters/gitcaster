/**
 * Legacy validation utilities - re-exports from split modules
 * @deprecated Use ValidationUtils namespace instead
 */

export {
  isValidEmail,
  normalizeEmail,
} from './validation/email';

export {
  isStrongPassword,
  getPasswordStrength,
} from './validation/password';

export {
  isPositiveNumber,
  isNonEmptyString,
  isValidUrl,
  isWithinRange,
  containsOnlyLetters,
  containsOnlyNumbers,
  isValidPhoneNumber,
} from './validation/common';
