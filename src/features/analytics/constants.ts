/**
 * Analytics feature constants
 */

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
  FORM_SUBMIT: 'form_submit',
  SEARCH: 'search',
  PROFILE_VIEW: 'profile_view',
  SHARE: 'share',
  DOWNLOAD: 'download',
  ERROR: 'error',
} as const;

export const ANALYTICS_METRICS = {
  COMMITS: 'commits',
  PULL_REQUESTS: 'pull_requests',
  ISSUES: 'issues',
  STARS: 'stars',
  FORKS: 'forks',
  CONTRIBUTORS: 'contributors',
  LANGUAGES: 'languages',
  REPOSITORIES: 'repositories',
} as const;

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  GRAY: '#6b7280',
} as const;

export const TIME_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  ALL_TIME: 'all_time',
} as const;

export const CAREER_STAGES = {
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  PRINCIPAL: 'principal',
} as const;

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export const IMPACT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750,
  },
} as const;

