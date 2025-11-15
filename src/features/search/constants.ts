/**
 * Search feature constants
 */

export const SEARCH_FILTERS = {
  LANGUAGES: 'languages',
  SKILLS: 'skills',
  LOCATION: 'location',
  EXPERIENCE: 'experience',
  AVAILABILITY: 'availability',
  STARS: 'stars',
} as const;

export const SORT_OPTIONS = {
  RELEVANCE: 'relevance',
  STARS: 'stars',
  CONTRIBUTIONS: 'contributions',
  FOLLOWERS: 'followers',
  RECENT: 'recent',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const MAX_SEARCH_HISTORY = 10;

export const POPULAR_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'C++',
  'Swift',
] as const;

export const POPULAR_SKILLS = [
  'React',
  'Node.js',
  'Next.js',
  'Vue',
  'Angular',
  'Docker',
  'Kubernetes',
  'AWS',
  'MongoDB',
  'PostgreSQL',
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-10 years)' },
  { value: 'lead', label: 'Lead (10+ years)' },
  { value: 'principal', label: 'Principal (15+ years)' },
] as const;

export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

