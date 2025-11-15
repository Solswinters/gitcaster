/**
 * Profile service for business logic
 */

import type { Profile, ProfileStats } from '../types';

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

