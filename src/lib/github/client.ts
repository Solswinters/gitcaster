import axios from 'axios';
import { GitHubUser, GitHubRepo, GitHubCommit, GitHubPullRequest, GitHubIssue, LanguageStats, ContributionDay } from '@/types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, options?: any): Promise<T> {
    try {
      const response = await axios({
        url: `${GITHUB_API_BASE}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        ...options,
      });
      return response.data;
    } catch (error: any) {
      console.error(`GitHub API Error (${endpoint}):`, error.response?.data || error.message);
      throw new Error(`Failed to fetch ${endpoint}: ${error.response?.data?.message || error.message}`);
    }
  }

  async getUser(): Promise<GitHubUser> {
    return this.request<GitHubUser>('/user');
  }

  async getRepositories(): Promise<GitHubRepo[]> {
    const repos = await this.request<GitHubRepo[]>('/user/repos?per_page=100&sort=updated');
    return repos;
  }

  async getCommits(username: string, repo?: string): Promise<GitHubCommit[]> {
    if (repo) {
      const commits = await this.request<GitHubCommit[]>(`/repos/${username}/${repo}/commits?author=${username}&per_page=100`);
      return commits;
    }
    
    // Get commits across all repos
    const repos = await this.getRepositories();
    const allCommits: GitHubCommit[] = [];
    
    for (const repository of repos.slice(0, 20)) {
      try {
        const commits = await this.request<GitHubCommit[]>(
          `/repos/${repository.full_name}/commits?author=${username}&per_page=100`
        );
        allCommits.push(...commits.map(c => ({ ...c, repository: { name: repository.name, full_name: repository.full_name } })));
      } catch (error) {
        // Continue if a repo fails
        console.log(`Skipping commits for ${repository.name}`);
      }
    }
    
    return allCommits;
  }

  async getPullRequests(username: string): Promise<GitHubPullRequest[]> {
    const query = `author:${username} type:pr`;
    const response = await this.request<{ items: GitHubPullRequest[] }>(
      `/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=updated`
    );
    return response.items;
  }

  async getIssues(username: string): Promise<GitHubIssue[]> {
    const query = `author:${username} type:issue`;
    const response = await this.request<{ items: GitHubIssue[] }>(
      `/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=updated`
    );
    return response.items;
  }

  async getLanguageStats(repos: GitHubRepo[]): Promise<LanguageStats[]> {
    const languageMap: { [key: string]: number } = {};
    
    for (const repo of repos) {
      try {
        const languages = await this.request<{ [key: string]: number }>(
          `/repos/${repo.full_name}/languages`
        );
        
        Object.entries(languages).forEach(([language, bytes]) => {
          languageMap[language] = (languageMap[language] || 0) + bytes;
        });
      } catch (error) {
        console.log(`Skipping languages for ${repo.name}`);
      }
    }
    
    const totalBytes = Object.values(languageMap).reduce((sum, bytes) => sum + bytes, 0);
    
    const languageColors: { [key: string]: string } = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      Rust: '#dea584',
      Ruby: '#701516',
      PHP: '#4F5D95',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051',
    };
    
    return Object.entries(languageMap)
      .map(([language, bytes]) => ({
        language,
        bytes,
        percentage: (bytes / totalBytes) * 100,
        color: languageColors[language] || '#cccccc',
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10);
  }

  async getContributionGraph(username: string): Promise<ContributionDay[]> {
    // This requires GitHub GraphQL API
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query,
          variables: { username },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const weeks = response.data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
      const days: ContributionDay[] = [];

      weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          const levelMap: { [key: string]: 0 | 1 | 2 | 3 | 4 } = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };

          days.push({
            date: day.date,
            count: day.contributionCount,
            level: levelMap[day.contributionLevel] || 0,
          });
        });
      });

      return days;
    } catch (error) {
      console.error('Error fetching contribution graph:', error);
      return [];
    }
  }
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error('Failed to exchange code for access token');
  }
}

