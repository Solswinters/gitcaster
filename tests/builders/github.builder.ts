/**
 * GitHub Data Builder
 * 
 * Fluent builder for creating test GitHub data.
 */

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
  private: boolean;
}

export class GitHubRepositoryBuilder {
  private data: Partial<GitHubRepository> = {
    id: 1,
    name: 'test-repo',
    full_name: 'user/test-repo',
    description: 'A test repository',
    stargazers_count: 0,
    forks_count: 0,
    language: null,
    updated_at: new Date().toISOString(),
    html_url: 'https://github.com/user/test-repo',
    private: false,
  };

  withId(id: number): this {
    this.data.id = id;
    return this;
  }

  withName(name: string): this {
    this.data.name = name;
    this.data.full_name = `user/${name}`;
    this.data.html_url = `https://github.com/user/${name}`;
    return this;
  }

  withDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  withStars(count: number): this {
    this.data.stargazers_count = count;
    return this;
  }

  withForks(count: number): this {
    this.data.forks_count = count;
    return this;
  }

  withLanguage(language: string): this {
    this.data.language = language;
    return this;
  }

  asPrivate(): this {
    this.data.private = true;
    return this;
  }

  asPublic(): this {
    this.data.private = false;
    return this;
  }

  popular(): this {
    this.data.stargazers_count = 1000;
    this.data.forks_count = 200;
    return this;
  }

  build(): GitHubRepository {
    return this.data as GitHubRepository;
  }

  buildMany(count: number): GitHubRepository[] {
    return Array.from({ length: count }, (_, i) => {
      this.data.id = i + 1;
      this.data.name = `test-repo-${i + 1}`;
      return this.build();
    });
  }
}

export class GitHubUserBuilder {
  private data: any = {
    login: 'testuser',
    id: 12345,
    avatar_url: 'https://avatars.githubusercontent.com/u/12345',
    html_url: 'https://github.com/testuser',
    name: 'Test User',
    company: null,
    blog: null,
    location: null,
    email: null,
    bio: null,
    public_repos: 0,
    followers: 0,
    following: 0,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  };

  withLogin(login: string): this {
    this.data.login = login;
    this.data.html_url = `https://github.com/${login}`;
    return this;
  }

  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  withBio(bio: string): this {
    this.data.bio = bio;
    return this;
  }

  withCompany(company: string): this {
    this.data.company = company;
    return this;
  }

  withLocation(location: string): this {
    this.data.location = location;
    return this;
  }

  withRepos(count: number): this {
    this.data.public_repos = count;
    return this;
  }

  withFollowers(count: number): this {
    this.data.followers = count;
    return this;
  }

  popular(): this {
    this.data.public_repos = 50;
    this.data.followers = 500;
    this.data.following = 100;
    return this;
  }

  build(): any {
    return this.data;
  }
}

/**
 * Create a new GitHub repository builder
 */
export function aRepository(): GitHubRepositoryBuilder {
  return new GitHubRepositoryBuilder();
}

/**
 * Create a new GitHub user builder
 */
export function aGitHubUser(): GitHubUserBuilder {
  return new GitHubUserBuilder();
}

