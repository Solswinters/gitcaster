/**
 * Profile service tests
 */

import { describe, it, expect } from '@jest/globals';
import { ProfileService } from '../services/profile-service';

describe('ProfileService', () => {
  it('should fetch profile by username', async () => {
    const profile = await ProfileService.getByUsername('testuser');
    expect(profile).toBeDefined();
  });

  it('should update profile', async () => {
    const updates = { bio: 'Updated bio' };
    const result = await ProfileService.updateProfile('user-id', updates);
    expect(result).toBeDefined();
  });
});

