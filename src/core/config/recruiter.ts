/**
 * Recruiter configuration
 */

export const recruiterConfig = {
  enabled: process.env.ENABLE_RECRUITER_TOOLS !== 'false',
  requireVerification: process.env.REQUIRE_RECRUITER_VERIFICATION !== 'false',
  maxJobPostings: parseInt(process.env.MAX_JOB_POSTINGS_PER_RECRUITER || '10'),
  maxSavedCandidates: parseInt(process.env.MAX_SAVED_CANDIDATES || '100'),
  searchResultLimit: parseInt(process.env.CANDIDATE_SEARCH_LIMIT || '20'),
} as const;

