/**
 * Job posting domain model
 */

import type { JobPosting } from '../types';
import { formatSalaryRange } from '../utils';

export class JobPostingModel {
  constructor(private posting: JobPosting) {}

  get id(): string {
    return this.posting.id;
  }

  get title(): string {
    return this.posting.title;
  }

  isPublished(): boolean {
    return this.posting.status === 'published';
  }

  isDraft(): boolean {
    return this.posting.status === 'draft';
  }

  isClosed(): boolean {
    return this.posting.status === 'closed';
  }

  isRemote(): boolean {
    return this.posting.remote;
  }

  getSalaryDisplay(): string {
    return formatSalaryRange(this.posting.salaryRange);
  }

  hasSkill(skill: string): boolean {
    return this.posting.skills.some(s => s.toLowerCase() === skill.toLowerCase());
  }

  getSkillsDisplay(): string {
    return this.posting.skills.join(', ');
  }

  toJSON(): JobPosting {
    return this.posting;
  }
}

