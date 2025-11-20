/**
 * Profile service for business logic
 */

import type { Profile, ProfileStats } from '../types';

interface ProfileSearchFilters {
  skills?: string[];
  location?: string;
  minScore?: number;
  hasExperience?: boolean;
  hasEducation?: boolean;
}

interface ProfileUpdateInput {
  displayName?: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  email?: string;
  avatarUrl?: string;
  skills?: string[];
}

export class ProfileService {
  /**
   * Calculate profile completion percentage
   */
  static calculateCompletion(profile: Profile): number {
    const fields = [
      profile.displayName,
      profile.bio,
      profile.location,
      profile.company,
      profile.website,
      profile.email,
      profile.avatarUrl,
      profile.skills.length > 0,
      profile.experience.length > 0,
      profile.education.length > 0,
      profile.socialLinks.github,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }

  /**
   * Validate profile data
   */
  static validateProfile(profile: Partial<Profile>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (profile.email && !this.isValidEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.website && !this.isValidUrl(profile.website)) {
      errors.push('Invalid website URL');
    }

    if (profile.displayName && profile.displayName.length > 100) {
      errors.push('Display name too long (max 100 characters)');
    }

    if (profile.bio && profile.bio.length > 500) {
      errors.push('Bio too long (max 500 characters)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format profile for display
   */
  static formatProfile(profile: Profile): Profile {
    return {
      ...profile,
      displayName: profile.displayName || profile.githubUsername,
      bio: profile.bio?.trim() || '',
      skills: profile.skills.map((s) => s.trim()).filter(Boolean),
    };
  }

  /**
   * Calculate profile score
   */
  static calculateScore(profile: Profile, stats?: ProfileStats): number {
    let score = 0;

    // Completion bonus
    const completion = this.calculateCompletion(profile);
    score += completion * 0.3;

    // Stats bonus
    if (stats) {
      score += Math.min(stats.commits / 100, 20);
      score += Math.min(stats.stars / 10, 20);
      score += Math.min(stats.repositories / 5, 15);
      score += Math.min(stats.followers / 10, 15);
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Merge profile data with updates
   */
  static mergeProfileData(
    current: Profile,
    updates: ProfileUpdateInput,
  ): Profile {
    return {
      ...current,
      ...updates,
      skills:
        updates.skills !== undefined
          ? updates.skills.map((s) => s.trim()).filter(Boolean)
          : current.skills,
      updatedAt: new Date(),
    };
  }

  /**
   * Compare two profiles for changes
   */
  static getProfileChanges(
    original: Profile,
    updated: Profile,
  ): Partial<Profile> {
    const changes: Partial<Profile> = {};

    (Object.keys(updated) as Array<keyof Profile>).forEach((key) => {
      if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
        changes[key] = updated[key] as any;
      }
    });

    return changes;
  }

  /**
   * Filter profiles based on criteria
   */
  static filterProfiles(
    profiles: Profile[],
    filters: ProfileSearchFilters,
  ): Profile[] {
    return profiles.filter((profile) => {
      // Filter by skills
      if (
        filters.skills &&
        filters.skills.length > 0 &&
        !filters.skills.some((skill) =>
          profile.skills.some(
            (s) => s.toLowerCase() === skill.toLowerCase(),
          ),
        )
      ) {
        return false;
      }

      // Filter by location
      if (
        filters.location &&
        profile.location?.toLowerCase() !== filters.location.toLowerCase()
      ) {
        return false;
      }

      // Filter by minimum score
      if (filters.minScore !== undefined) {
        const score = this.calculateScore(profile);
        if (score < filters.minScore) {
          return false;
        }
      }

      // Filter by experience
      if (
        filters.hasExperience &&
        (!profile.experience || profile.experience.length === 0)
      ) {
        return false;
      }

      // Filter by education
      if (
        filters.hasEducation &&
        (!profile.education || profile.education.length === 0)
      ) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort profiles by various criteria
   */
  static sortProfiles(
    profiles: Profile[],
    sortBy: 'score' | 'completion' | 'recent',
    order: 'asc' | 'desc' = 'desc',
  ): Profile[] {
    const sorted = [...profiles];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'score':
          comparison = this.calculateScore(a) - this.calculateScore(b);
          break;
        case 'completion':
          comparison = this.calculateCompletion(a) - this.calculateCompletion(b);
          break;
        case 'recent':
          comparison =
            new Date(a.updatedAt || 0).getTime() -
            new Date(b.updatedAt || 0).getTime();
          break;
      }

      return order === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  /**
   * Get profile suggestions for improvement
   */
  static getProfileSuggestions(profile: Profile): string[] {
    const suggestions: string[] = [];

    if (!profile.bio || profile.bio.length < 50) {
      suggestions.push('Add a detailed bio to describe yourself');
    }

    if (!profile.avatarUrl) {
      suggestions.push('Upload a profile picture');
    }

    if (profile.skills.length < 3) {
      suggestions.push('Add more skills to showcase your expertise');
    }

    if (!profile.location) {
      suggestions.push('Add your location to improve discoverability');
    }

    if (
      !profile.experience ||
      profile.experience.length === 0
    ) {
      suggestions.push('Add your work experience');
    }

    if (
      !profile.education ||
      profile.education.length === 0
    ) {
      suggestions.push('Add your education background');
    }

    if (!profile.website) {
      suggestions.push('Add your personal website or portfolio');
    }

    if (!profile.email) {
      suggestions.push('Add a contact email');
    }

    return suggestions;
  }

  /**
   * Sanitize profile data for public display
   */
  static sanitizeForPublic(profile: Profile): Partial<Profile> {
    const {
      email,
      walletAddress,
      ...publicProfile
    } = profile;

    return publicProfile;
  }

  /**
   * Extract keywords from profile for search indexing
   */
  static extractKeywords(profile: Profile): string[] {
    const keywords = new Set<string>();

    // Add skills
    profile.skills.forEach((skill) =>
      keywords.add(skill.toLowerCase()),
    );

    // Add location
    if (profile.location) {
      keywords.add(profile.location.toLowerCase());
    }

    // Add company
    if (profile.company) {
      keywords.add(profile.company.toLowerCase());
    }

    // Add bio words (exclude common words)
    if (profile.bio) {
      const words = profile.bio
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3);
      words.forEach((word) => keywords.add(word));
    }

    return Array.from(keywords);
  }

  /**
   * Check if profile is verified
   */
  static isVerified(profile: Profile): boolean {
    return !!(
      profile.githubUsername &&
      profile.walletAddress &&
      this.calculateCompletion(profile) >= 70
    );
  }

  /**
   * Get profile tier based on score
   */
  static getProfileTier(
    profile: Profile,
    stats?: ProfileStats,
  ): 'bronze' | 'silver' | 'gold' | 'platinum' {
    const score = this.calculateScore(profile, stats);

    if (score >= 90) return 'platinum';
    if (score >= 75) return 'gold';
    if (score >= 50) return 'silver';
    return 'bronze';
  }

  /**
   * Calculate profile engagement score
   */
  static calculateEngagementScore(stats?: ProfileStats): number {
    if (!stats) return 0;

    let engagement = 0;

    // Recent activity weight
    engagement += Math.min(stats.commits / 50, 30);
    engagement += Math.min(stats.pullRequests / 10, 20);
    engagement += Math.min(stats.issues / 10, 15);
    engagement += Math.min(stats.contributions / 100, 20);
    engagement += Math.min(stats.stars / 20, 15);

    return Math.min(100, Math.round(engagement));
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

