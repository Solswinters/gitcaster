/**
 * GitLab API client for integration
 */

export class GitLabClient {
  private accessToken: string
  private baseURL: string = 'https://gitlab.com/api/v4'

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  /**
   * Get user profile
   */
  async getUser(username: string) {
    const response = await fetch(`${this.baseURL}/users?username=${username}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })
    
    if (!response.ok) throw new Error('Failed to fetch GitLab user')
    const users = await response.json()
    return users[0]
  }

  /**
   * Get user projects
   */
  async getProjects(userId: number, options: { page?: number; perPage?: number } = {}) {
    const { page = 1, perPage = 20 } = options
    const response = await fetch(
      `${this.baseURL}/users/${userId}/projects?page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    )
    
    if (!response.ok) throw new Error('Failed to fetch projects')
    return await response.json()
  }

  /**
   * Get user contributions
   */
  async getContributions(userId: number) {
    const response = await fetch(`${this.baseURL}/users/${userId}/events`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })
    
    if (!response.ok) throw new Error('Failed to fetch contributions')
    return await response.json()
  }

  /**
   * Get merge requests
   */
  async getMergeRequests(userId: number) {
    const response = await fetch(
      `${this.baseURL}/merge_requests?author_id=${userId}&scope=all`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    )
    
    if (!response.ok) throw new Error('Failed to fetch merge requests')
    return await response.json()
  }
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeGitLabCode(code: string): Promise<string> {
  const response = await fetch('https://gitlab.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITLAB_CLIENT_ID,
      client_secret: process.env.GITLAB_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GITLAB_REDIRECT_URI,
    }),
  })

  if (!response.ok) throw new Error('Failed to exchange code')
  
  const data = await response.json()
  return data.access_token
}

