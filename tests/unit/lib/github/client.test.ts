import axios from 'axios'
import { GitHubClient, exchangeCodeForToken } from '@/lib/github/client'
import { mockGitHubUser, mockRepository } from '../../../utils/mock-data'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('GitHubClient', () => {
  let client: GitHubClient
  const mockToken = 'mock-github-token'

  beforeEach(() => {
    client = new GitHubClient(mockToken)
    jest.clearAllMocks()
  })

  describe('getUser', () => {
    it('should fetch user data successfully', async () => {
      mockedAxios.mockResolvedValueOnce({ data: mockGitHubUser })

      const result = await client.getUser()

      expect(result).toEqual(mockGitHubUser)
      expect(mockedAxios).toHaveBeenCalledWith({
        url: 'https://api.github.com/user',
        headers: {
          Authorization: `Bearer ${mockToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
    })

    it('should throw error on API failure', async () => {
      const errorMessage = 'Unauthorized'
      mockedAxios.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      })

      await expect(client.getUser()).rejects.toThrow()
    })
  })

  describe('getRepositories', () => {
    it('should fetch repositories successfully', async () => {
      const mockRepos = [mockRepository]
      mockedAxios.mockResolvedValueOnce({ data: mockRepos })

      const result = await client.getRepositories()

      expect(result).toEqual(mockRepos)
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.github.com/user/repos?per_page=100&sort=updated',
        })
      )
    })

    it('should return empty array on error', async () => {
      mockedAxios.mockRejectedValueOnce(new Error('API Error'))

      await expect(client.getRepositories()).rejects.toThrow()
    })
  })

  describe('getCommits', () => {
    const mockCommits = [
      {
        sha: 'abc123',
        commit: {
          message: 'feat: add feature',
          author: {
            name: 'Test User',
            email: 'test@example.com',
            date: '2024-01-01T00:00:00Z',
          },
        },
      },
    ]

    it('should fetch commits for a specific repo', async () => {
      mockedAxios.mockResolvedValueOnce({ data: mockCommits })

      const result = await client.getCommits('testuser', 'test-repo')

      expect(result).toEqual(mockCommits)
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.github.com/repos/testuser/test-repo/commits?author=testuser&per_page=100',
        })
      )
    })

    it('should fetch commits across all repos when no repo specified', async () => {
      const mockRepos = [mockRepository]
      mockedAxios
        .mockResolvedValueOnce({ data: mockRepos })
        .mockResolvedValueOnce({ data: mockCommits })

      const result = await client.getCommits('testuser')

      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('repository')
    })
  })

  describe('getPullRequests', () => {
    it('should fetch pull requests successfully', async () => {
      const mockPRs = [{ id: 1, title: 'Test PR', state: 'open' }]
      mockedAxios.mockResolvedValueOnce({ data: { items: mockPRs } })

      const result = await client.getPullRequests('testuser')

      expect(result).toEqual(mockPRs)
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('/search/issues?q=author%3Atestuser%20type%3Apr'),
        })
      )
    })
  })

  describe('getIssues', () => {
    it('should fetch issues successfully', async () => {
      const mockIssues = [{ id: 1, title: 'Test Issue', state: 'open' }]
      mockedAxios.mockResolvedValueOnce({ data: { items: mockIssues } })

      const result = await client.getIssues('testuser')

      expect(result).toEqual(mockIssues)
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('/search/issues?q=author%3Atestuser%20type%3Aissue'),
        })
      )
    })
  })

  describe('getLanguageStats', () => {
    it('should calculate language statistics correctly', async () => {
      const mockRepos = [mockRepository]
      const mockLanguages = { TypeScript: 50000, JavaScript: 30000 }
      mockedAxios.mockResolvedValueOnce({ data: mockLanguages })

      const result = await client.getLanguageStats(mockRepos)

      expect(result).toHaveLength(2)
      expect(result[0].language).toBe('TypeScript')
      expect(result[0].percentage).toBeCloseTo(62.5, 1)
      expect(result[1].language).toBe('JavaScript')
      expect(result[1].percentage).toBeCloseTo(37.5, 1)
    })

    it('should handle errors gracefully and continue', async () => {
      const mockRepos = [mockRepository, { ...mockRepository, id: 2, name: 'repo2' }]
      mockedAxios
        .mockResolvedValueOnce({ data: { TypeScript: 1000 } })
        .mockRejectedValueOnce(new Error('Failed'))

      const result = await client.getLanguageStats(mockRepos)

      expect(result).toHaveLength(1)
      expect(result[0].language).toBe('TypeScript')
    })

    it('should limit results to top 10 languages', async () => {
      const mockRepos = [mockRepository]
      const mockLanguages: { [key: string]: number } = {}
      for (let i = 1; i <= 15; i++) {
        mockLanguages[`Lang${i}`] = 1000 * (16 - i)
      }
      mockedAxios.mockResolvedValueOnce({ data: mockLanguages })

      const result = await client.getLanguageStats(mockRepos)

      expect(result).toHaveLength(10)
    })
  })

  describe('getContributionGraph', () => {
    it('should fetch contribution graph data', async () => {
      const mockGraphQLResponse = {
        data: {
          data: {
            user: {
              contributionsCollection: {
                contributionCalendar: {
                  weeks: [
                    {
                      contributionDays: [
                        {
                          date: '2024-01-01',
                          contributionCount: 5,
                          contributionLevel: 'SECOND_QUARTILE',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      }
      mockedAxios.post = jest.fn().mockResolvedValueOnce(mockGraphQLResponse)

      const result = await client.getContributionGraph('testuser')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        date: '2024-01-01',
        count: 5,
        level: 2,
      })
    })

    it('should return empty array on GraphQL error', async () => {
      mockedAxios.post = jest.fn().mockRejectedValueOnce(new Error('GraphQL Error'))

      const result = await client.getContributionGraph('testuser')

      expect(result).toEqual([])
    })
  })
})

describe('exchangeCodeForToken', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should exchange OAuth code for access token', async () => {
    const mockAccessToken = 'gho_mockAccessToken123'
    mockedAxios.post = jest.fn().mockResolvedValueOnce({
      data: { access_token: mockAccessToken },
    })

    const result = await exchangeCodeForToken('mock-code')

    expect(result).toBe(mockAccessToken)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://github.com/login/oauth/access_token',
      expect.objectContaining({
        code: 'mock-code',
      }),
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      })
    )
  })

  it('should throw error when exchange fails', async () => {
    mockedAxios.post = jest.fn().mockRejectedValueOnce({
      response: { data: { error: 'invalid_code' } },
    })

    await expect(exchangeCodeForToken('invalid-code')).rejects.toThrow()
  })
})

