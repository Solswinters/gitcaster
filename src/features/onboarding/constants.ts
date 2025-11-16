/**
 * Onboarding feature constants
 */

export const ONBOARDING_FLOWS = {
  DEFAULT: 'default',
  DEVELOPER: 'developer',
  RECRUITER: 'recruiter',
} as const;

export const ONBOARDING_STEPS = {
  CONNECT_WALLET: 'connect-wallet',
  CONNECT_GITHUB: 'github-profile',
  COMPLETE_PROFILE: 'complete-profile',
  SET_PREFERENCES: 'set-preferences',
} as const;

export const STORAGE_KEYS = {
  PROGRESS: 'onboarding-progress',
  DATA: 'onboarding-data',
  COMPLETED: 'onboarding-completed',
} as const;

