/**
 * Recruiter feature constants
 */

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
} as const;

export const JOB_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
} as const;

export const CANDIDATE_STATUS = {
  INTERESTED: 'interested',
  CONTACTED: 'contacted',
  INTERVIEWING: 'interviewing',
  OFFERED: 'offered',
  REJECTED: 'rejected',
} as const;

export const DEFAULT_SEARCH_LIMIT = 20;
export const MIN_TALENT_SCORE = 0;
export const MAX_TALENT_SCORE = 100;

