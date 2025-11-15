/**
 * Profile domain model
 */

import type { Profile } from '../types';

export class ProfileModel {
  constructor(private profile: Profile) {}

  get id(): string {
    return this.profile.id;
  }

  get displayName(): string {
    return this.profile.displayName || this.profile.githubUsername;
  }

  get isComplete(): boolean {
    return this.getCompletionPercentage() >= 80;
  }

  getCompletionPercentage(): number {
    const requiredFields = [
      this.profile.displayName,
      this.profile.bio,
      this.profile.location,
      this.profile.skills.length > 0,
      this.profile.experience.length > 0,
    ];

    const completed = requiredFields.filter(Boolean).length;
    return Math.round((completed / requiredFields.length) * 100);
  }

  getMissingFields(): string[] {
    const missing: string[] = [];

    if (!this.profile.displayName) missing.push('displayName');
    if (!this.profile.bio) missing.push('bio');
    if (!this.profile.location) missing.push('location');
    if (this.profile.skills.length === 0) missing.push('skills');
    if (this.profile.experience.length === 0) missing.push('experience');

    return missing;
  }

  hasExperience(): boolean {
    return this.profile.experience.length > 0;
  }

  hasEducation(): boolean {
    return this.profile.education.length > 0;
  }

  getTotalYearsOfExperience(): number {
    return this.profile.experience.reduce((total, exp) => {
      const endDate = exp.endDate || new Date();
      const years = (endDate.getTime() - exp.startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);
  }

  toJSON(): Profile {
    return this.profile;
  }
}

