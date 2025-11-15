/**
 * GitHub Domain Validators
 * 
 * Validation rules for GitHub-related data.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate GitHub username format
 */
export function validateGitHubUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (!username || username.trim().length === 0) {
    errors.push('GitHub username is required');
    return { isValid: false, errors };
  }

  // GitHub username rules:
  // - May only contain alphanumeric characters or hyphens
  // - Cannot have multiple consecutive hyphens
  // - Cannot begin or end with a hyphen
  // - Maximum 39 characters
  const githubUsernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|-(?!-))*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;

  if (!githubUsernameRegex.test(username)) {
    errors.push('Invalid GitHub username format');
  }

  if (username.length > 39) {
    errors.push('GitHub username must be 39 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate repository name format
 */
export function validateRepositoryName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Repository name is required');
    return { isValid: false, errors };
  }

  // Repository name rules (simplified):
  // - Cannot contain certain special characters
  // - Cannot start with a dot
  // - Maximum 100 characters
  if (name.startsWith('.')) {
    errors.push('Repository name cannot start with a dot');
  }

  if (name.length > 100) {
    errors.push('Repository name must be 100 characters or less');
  }

  const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;
  if (invalidChars.test(name)) {
    errors.push('Repository name contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate GitHub access token format
 */
export function validateAccessToken(token: string): boolean {
  // Basic validation - tokens should be non-empty strings
  // Real validation happens on GitHub's side
  return typeof token === 'string' && token.length > 0;
}

