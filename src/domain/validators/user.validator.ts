/**
 * User Domain Validators
 * 
 * Business rule validation for user entities.
 */

import type { UserProfile } from '../entities';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate user profile data
 */
export function validateUserProfile(profile: Partial<UserProfile>): ValidationResult {
  const errors: string[] = [];

  if (profile.displayName !== undefined) {
    if (!profile.displayName || profile.displayName.trim().length === 0) {
      errors.push('Display name is required');
    } else if (profile.displayName.length > 100) {
      errors.push('Display name must be less than 100 characters');
    }
  }

  if (profile.bio !== undefined && profile.bio !== null) {
    if (profile.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }
  }

  if (profile.slug !== undefined) {
    if (!isValidSlug(profile.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
  }

  if (profile.website !== undefined && profile.website !== null) {
    if (!isValidUrl(profile.website)) {
      errors.push('Website must be a valid URL');
    }
  }

  if (profile.walletAddress !== undefined) {
    if (!isValidWalletAddress(profile.walletAddress)) {
      errors.push('Invalid wallet address format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate wallet address format (Ethereum)
 */
export function isValidWalletAddress(address: string): boolean {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}

/**
 * Check if profile meets minimum completeness requirements
 */
export function meetsMinimumRequirements(profile: UserProfile): ValidationResult {
  const errors: string[] = [];

  if (!profile.displayName) {
    errors.push('Display name is required');
  }

  if (!profile.walletAddress) {
    errors.push('Wallet address is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

