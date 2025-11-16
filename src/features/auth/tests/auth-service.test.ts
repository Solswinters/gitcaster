/**
 * Auth service tests
 */

import { describe, it, expect } from '@jest/globals';
import { AuthService } from '../services/auth-service';

describe('AuthService', () => {
  it('should authenticate user', async () => {
    const result = await AuthService.login({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result).toBeDefined();
  });

  it('should register new user', async () => {
    const result = await AuthService.register({
      email: 'new@example.com',
      password: 'password123',
      username: 'newuser',
    });
    expect(result).toBeDefined();
  });
});

