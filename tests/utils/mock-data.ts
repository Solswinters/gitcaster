/**
 * Mock data for testing
 */

export const mockGitHubUser = {
  login: 'testuser',
  id: 12345,
  avatar_url: 'https://avatars.githubusercontent.com/u/12345',
  name: 'Test User',
  company: 'Test Company',
  blog: 'https://test.com',
  location: 'San Francisco, CA',
  email: 'test@example.com',
  bio: 'A test user for testing purposes',
  twitter_username: 'testuser',
  public_repos: 50,
  public_gists: 10,
  followers: 100,
  following: 50,
  created_at: '2020-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockRepository = {
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  description: 'A test repository',
  html_url: 'https://github.com/testuser/test-repo',
  stargazers_count: 100,
  forks_count: 20,
  language: 'TypeScript',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  pushed_at: '2024-01-01T00:00:00Z',
}

export const mockProfile = {
  id: '1',
  address: '0x1234567890abcdef1234567890abcdef12345678',
  githubUsername: 'testuser',
  githubData: mockGitHubUser,
  repositories: [mockRepository],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockTalentScore = {
  score: 85,
  passport_id: 123,
  passport_profile: {
    display_name: 'Test User',
    bio: 'A test user',
  },
}

export const mockSession = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  isConnected: true,
  nonce: 'test-nonce-12345',
}

