/**
 * Recruiter utility helpers
 */

import type { JobPosting, Candidate, CandidateSearch } from '../types';

export function formatSalaryRange(range?: { min: number; max: number; currency: string }): string {
  if (!range) return 'Not specified';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: range.currency,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(range.min)} - ${formatter.format(range.max)}`;
}

export function matchCandidateToJob(candidate: Candidate, job: JobPosting): number {
  let score = 0;
  const maxScore = 100;

  // Skill matching (50 points)
  const matchingSkills = candidate.skills.filter(skill =>
    job.skills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
  );
  const skillScore = (matchingSkills.length / job.skills.length) * 50;
  score += skillScore;

  // Experience matching (30 points)
  if (candidate.experience >= 0) {
    // Assume job requires 2-5 years typically
    const idealExperience = 3;
    const experienceDiff = Math.abs(candidate.experience - idealExperience);
    const experienceScore = Math.max(0, 30 - (experienceDiff * 5));
    score += experienceScore;
  }

  // Talent score (20 points)
  if (candidate.talentScore) {
    const talentScore = (candidate.talentScore / 100) * 20;
    score += talentScore;
  }

  return Math.min(Math.round(score), maxScore);
}

export function filterCandidates(candidates: Candidate[], search: CandidateSearch): Candidate[] {
  return candidates.filter(candidate => {
    // Filter by skills
    if (search.skills && search.skills.length > 0) {
      const hasSkills = search.skills.some(skill =>
        candidate.skills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      );
      if (!hasSkills) return false;
    }

    // Filter by experience range
    if (search.minExperience !== undefined && candidate.experience < search.minExperience) {
      return false;
    }
    if (search.maxExperience !== undefined && candidate.experience > search.maxExperience) {
      return false;
    }

    // Filter by talent score
    if (search.minTalentScore && candidate.talentScore) {
      if (candidate.talentScore < search.minTalentScore) {
        return false;
      }
    }

    return true;
  });
}

export function getJobStatusColor(status: JobPosting['status']): string {
  switch (status) {
    case 'published':
      return 'green';
    case 'draft':
      return 'yellow';
    case 'closed':
      return 'red';
    default:
      return 'gray';
  }
}

