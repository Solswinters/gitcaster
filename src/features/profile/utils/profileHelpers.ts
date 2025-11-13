/**
 * Profile Helper Utilities
 * 
 * Helper functions for working with profile data
 */

import { UserProfile } from '../types/profile.types';

/**
 * Generate profile URL
 */
export function getProfileUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/profile/${slug}`;
}

/**
 * Generate slug from wallet address
 */
export function generateSlug(walletAddress: string): string {
  return walletAddress.toLowerCase();
}

/**
 * Check if profile is complete
 */
export function isProfileComplete(profile: UserProfile): boolean {
  const requiredFields: (keyof UserProfile)[] = [
    'displayName',
    'bio',
    'githubUsername',
  ];

  return requiredFields.every(field => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== '';
  });
}

/**
 * Get profile completion percentage
 */
export function getCompletionPercentage(profile: UserProfile): number {
  const allFields: (keyof UserProfile)[] = [
    'displayName',
    'bio',
    'avatarUrl',
    'location',
    'company',
    'website',
    'githubUsername',
    'talentScore',
  ];

  const completed = allFields.filter(field => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== '';
  }).length;

  return Math.round((completed / allFields.length) * 100);
}

/**
 * Get missing profile fields
 */
export function getMissingFields(profile: UserProfile): string[] {
  const fields = [
    { key: 'displayName', label: 'Display Name' },
    { key: 'bio', label: 'Bio' },
    { key: 'avatarUrl', label: 'Profile Picture' },
    { key: 'location', label: 'Location' },
    { key: 'company', label: 'Company' },
    { key: 'website', label: 'Website' },
    { key: 'githubUsername', label: 'GitHub Username' },
    { key: 'talentScore', label: 'Talent Score' },
  ];

  return fields
    .filter(field => {
      const value = profile[field.key as keyof UserProfile];
      return value === null || value === undefined || value === '';
    })
    .map(field => field.label);
}

/**
 * Format display name with fallback
 */
export function getDisplayName(profile: UserProfile): string {
  return (
    profile.displayName ||
    profile.githubUsername ||
    `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}`
  );
}

/**
 * Get avatar URL with fallback
 */
export function getAvatarUrl(profile: UserProfile): string {
  if (profile.avatarUrl) {
    return profile.avatarUrl;
  }

  // Use GitHub avatar if available
  if (profile.githubUsername) {
    return `https://github.com/${profile.githubUsername}.png`;
  }

  // Default avatar
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.walletAddress}`;
}

/**
 * Format profile stats summary
 */
export function getStatsSummary(profile: UserProfile): {
  repos: number;
  stars: number;
  commits: number;
  prs: number;
} {
  return {
    repos: profile.githubStats?.publicRepos || 0,
    stars: profile.githubStats?.totalStars || 0,
    commits: profile.githubStats?.totalCommits || 0,
    prs: profile.githubStats?.totalPRs || 0,
  };
}

/**
 * Check if profile is public
 */
export function isPublicProfile(profile: UserProfile): boolean {
  return profile.isPublic;
}

/**
 * Check if user owns profile
 */
export function isProfileOwner(profile: UserProfile, currentAddress?: string): boolean {
  if (!currentAddress) return false;
  return profile.walletAddress.toLowerCase() === currentAddress.toLowerCase();
}

/**
 * Format profile metadata for sharing
 */
export function getShareMetadata(profile: UserProfile, baseUrl?: string): {
  title: string;
  description: string;
  url: string;
  image: string;
} {
  const displayName = getDisplayName(profile);
  const stats = getStatsSummary(profile);
  
  return {
    title: `${displayName} - GitCaster Profile`,
    description: profile.bio || `Developer with ${stats.repos} repositories and ${stats.stars} stars`,
    url: getProfileUrl(profile.slug, baseUrl),
    image: getAvatarUrl(profile),
  };
}

/**
 * Calculate profile score based on activity
 */
export function calculateProfileScore(profile: UserProfile): number {
  let score = 0;

  // Basic profile completion (30 points)
  score += getCompletionPercentage(profile) * 0.3;

  // GitHub stats (40 points)
  if (profile.githubStats) {
    const stats = profile.githubStats;
    score += Math.min(stats.publicRepos * 0.5, 10);
    score += Math.min(stats.totalStars * 0.01, 10);
    score += Math.min(stats.totalCommits * 0.001, 10);
    score += Math.min(stats.totalPRs * 0.1, 10);
  }

  // Talent score (30 points)
  if (profile.talentScore) {
    score += (profile.talentScore / 100) * 30;
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Get profile quality rating
 */
export function getProfileRating(profile: UserProfile): 'Poor' | 'Fair' | 'Good' | 'Excellent' {
  const score = calculateProfileScore(profile);

  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

/**
 * Format view count
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Get top languages from GitHub stats
 */
export function getTopLanguages(profile: UserProfile, limit = 5): string[] {
  if (!profile.githubStats?.languages) {
    return [];
  }

  return profile.githubStats.languages
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, limit)
    .map(lang => lang.language);
}

/**
 * Check if profile has GitHub data
 */
export function hasGitHubData(profile: UserProfile): boolean {
  return !!(profile.githubUsername && profile.githubStats);
}

/**
 * Check if profile has Talent Protocol data
 */
export function hasTalentProtocolData(profile: UserProfile): boolean {
  return profile.talentScore !== null && profile.talentScore !== undefined;
}

/**
 * Get profile age in days
 */
export function getProfileAge(profile: UserProfile): number {
  const created = new Date(profile.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get last update time
 */
export function getLastUpdateTime(profile: UserProfile): string {
  const updated = new Date(profile.updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

