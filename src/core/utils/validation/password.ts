/**
 * Password validation utilities
 */

export function isStrongPassword(password: string, minLength: number = 8): boolean {
  if (password.length < minLength) {
    return false;
  }
  
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/;
  return strongPasswordRegex.test(password);
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak';
  
  let strength = 0;
  
  // Check length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Check for lowercase
  if (/[a-z]/.test(password)) strength++;
  
  // Check for uppercase
  if (/[A-Z]/.test(password)) strength++;
  
  // Check for numbers
  if (/\d/.test(password)) strength++;
  
  // Check for special characters
  if (/[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
}

