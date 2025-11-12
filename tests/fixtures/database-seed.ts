/**
 * Database seed data for testing
 * Use this to populate test database with sample data
 */

export const testUsers = [
  {
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    githubUsername: 'testuser1',
    githubAccessToken: 'gho_test_token_1',
  },
  {
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    githubUsername: 'testuser2',
    githubAccessToken: 'gho_test_token_2',
  },
  {
    walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
    githubUsername: 'testuser3',
    githubAccessToken: null, // User without GitHub connected
  },
]

export const testGitHubData = {
  testuser1: {
    user: {
      login: 'testuser1',
      id: 1001,
      avatar_url: 'https://avatars.githubusercontent.com/u/1001',
      name: 'Test User One',
      company: 'Test Company',
      location: 'San Francisco, CA',
      email: 'testuser1@example.com',
      bio: 'Full-stack developer',
      public_repos: 45,
      followers: 120,
      following: 80,
      created_at: '2020-01-01T00:00:00Z',
    },
    repositories: [
      {
        id: 101,
        name: 'awesome-project',
        full_name: 'testuser1/awesome-project',
        description: 'An awesome open source project',
        stargazers_count: 250,
        forks_count: 50,
        language: 'TypeScript',
      },
      {
        id: 102,
        name: 'cool-library',
        full_name: 'testuser1/cool-library',
        description: 'A cool JavaScript library',
        stargazers_count: 100,
        forks_count: 20,
        language: 'JavaScript',
      },
    ],
  },
  testuser2: {
    user: {
      login: 'testuser2',
      id: 1002,
      avatar_url: 'https://avatars.githubusercontent.com/u/1002',
      name: 'Test User Two',
      company: 'Another Company',
      location: 'New York, NY',
      email: 'testuser2@example.com',
      bio: 'Backend engineer',
      public_repos: 30,
      followers: 80,
      following: 50,
      created_at: '2021-01-01T00:00:00Z',
    },
    repositories: [
      {
        id: 201,
        name: 'api-service',
        full_name: 'testuser2/api-service',
        description: 'REST API service',
        stargazers_count: 75,
        forks_count: 15,
        language: 'Python',
      },
    ],
  },
}

export const testTalentScores = {
  '0x1234567890abcdef1234567890abcdef12345678': {
    score: 85,
    passport_id: 1001,
    passport_profile: {
      display_name: 'Test User One',
      bio: 'Experienced developer',
    },
  },
  '0xabcdef1234567890abcdef1234567890abcdef12': {
    score: 72,
    passport_id: 1002,
    passport_profile: {
      display_name: 'Test User Two',
      bio: 'Backend specialist',
    },
  },
}

