/**
 * GitHub client tests
 */

import { describe, it, expect } from '@jest/globals';
import { GitHubClient } from '../services/github-client';

describe('GitHubClient', () => {
  it('should fetch user data', async () => {
    const user = await GitHubClient.getUser('testuser');
    expect(user).toBeDefined();
  });

  it('should fetch user repositories', async () => {
    const repos = await GitHubClient.getUserRepositories('testuser');
    expect(repos).toBeInstanceOf(Array);
  });
});

