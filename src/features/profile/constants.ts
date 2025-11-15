/**
 * Profile feature constants
 */

export const PROFILE_FIELDS = {
  DISPLAY_NAME: 'displayName',
  BIO: 'bio',
  LOCATION: 'location',
  COMPANY: 'company',
  WEBSITE: 'website',
  EMAIL: 'email',
  PHONE: 'phone',
} as const;

export const PROFILE_TABS = {
  ABOUT: 'about',
  PROJECTS: 'projects',
  STATS: 'stats',
  CONTACT: 'contact',
  ACTIVITY: 'activity',
} as const;

export const SOCIAL_PLATFORMS = {
  GITHUB: 'github',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  WEBSITE: 'website',
  BLOG: 'blog',
  STACKOVERFLOW: 'stackoverflow',
} as const;

export const PROFILE_COMPLETION_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  COMPLETE: 100,
} as const;

export const MAX_SKILLS_DISPLAY = 10;
export const MAX_BIO_LENGTH = 500;
export const MAX_DISPLAY_NAME_LENGTH = 100;
export const MAX_EXPERIENCE_ITEMS = 20;
export const MAX_EDUCATION_ITEMS = 10;

export const PROFILE_VALIDATION_RULES = {
  displayName: {
    minLength: 2,
    maxLength: MAX_DISPLAY_NAME_LENGTH,
  },
  bio: {
    maxLength: MAX_BIO_LENGTH,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  website: {
    pattern: /^https?:\/\/.+/,
  },
} as const;

