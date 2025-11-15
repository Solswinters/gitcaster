/**
 * Profile formatting utilities
 */

import type { Profile } from '../types';

export function formatProfileUrl(username: string): string {
  return `/profile/${username}`;
}

export function formatGitHubUrl(username: string): string {
  return `https://github.com/${username}`;
}

export function formatExperienceYears(years: number): string {
  if (years < 1) return 'Less than a year';
  if (years === 1) return '1 year';
  return `${Math.round(years)} years`;
}

export function formatSkillsList(skills: string[], maxDisplay: number = 5): {
  displayed: string[];
  remaining: number;
} {
  return {
    displayed: skills.slice(0, maxDisplay),
    remaining: Math.max(0, skills.length - maxDisplay),
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function sanitizeProfileData(profile: Partial<Profile>): Partial<Profile> {
  return {
    ...profile,
    displayName: profile.displayName?.trim(),
    bio: profile.bio?.trim(),
    location: profile.location?.trim(),
    company: profile.company?.trim(),
    skills: profile.skills?.map((s) => s.trim()).filter(Boolean),
  };
}

