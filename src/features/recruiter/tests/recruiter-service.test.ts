/**
 * Recruiter service tests
 */

import { describe, it, expect } from '@jest/globals';
import { RecruiterService } from '../services/recruiter-service';

describe('RecruiterService', () => {
  it('should create job posting', async () => {
    const posting = await RecruiterService.createJobPosting({
      recruiterId: 'recruiter-id',
      title: 'Software Engineer',
      description: 'We are hiring',
      requirements: ['5 years experience'],
      skills: ['TypeScript', 'React'],
      location: 'Remote',
      remote: true,
      employmentType: 'full-time',
      status: 'draft',
    });
    expect(posting).toBeDefined();
    expect(posting.id).toBeDefined();
  });

  it('should search candidates', async () => {
    const results = await RecruiterService.searchCandidates({
      skills: ['TypeScript'],
      minExperience: 3,
    });
    expect(results).toBeInstanceOf(Array);
  });
});

