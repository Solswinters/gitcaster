/**
 * User Data Builder
 * 
 * Fluent builder for creating test user data.
 */

import type { UserProfile } from '@/domain/entities';

export class UserBuilder {
  private data: Partial<UserProfile> = {
    id: 'test-user-1',
    slug: 'test-user',
    displayName: 'Test User',
    bio: null,
    avatarUrl: null,
    location: null,
    company: null,
    website: null,
    walletAddress: '0x1234567890123456789012345678901234567890',
    githubUsername: null,
    talentScore: null,
    isPublic: false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  withId(id: string): this {
    this.data.id = id;
    return this;
  }

  withSlug(slug: string): this {
    this.data.slug = slug;
    return this;
  }

  withDisplayName(displayName: string): this {
    this.data.displayName = displayName;
    return this;
  }

  withBio(bio: string): this {
    this.data.bio = bio;
    return this;
  }

  withAvatar(url: string): this {
    this.data.avatarUrl = url;
    return this;
  }

  withLocation(location: string): this {
    this.data.location = location;
    return this;
  }

  withCompany(company: string): this {
    this.data.company = company;
    return this;
  }

  withWebsite(website: string): this {
    this.data.website = website;
    return this;
  }

  withWalletAddress(address: string): this {
    this.data.walletAddress = address;
    return this;
  }

  withGitHub(username: string): this {
    this.data.githubUsername = username;
    return this;
  }

  withTalentScore(score: number): this {
    this.data.talentScore = score;
    return this;
  }

  asPublic(): this {
    this.data.isPublic = true;
    return this;
  }

  asPrivate(): this {
    this.data.isPublic = false;
    return this;
  }

  withViewCount(count: number): this {
    this.data.viewCount = count;
    return this;
  }

  /**
   * Build a complete user profile
   */
  complete(): this {
    this.data.bio = 'A complete test bio';
    this.data.avatarUrl = 'https://example.com/avatar.jpg';
    this.data.location = 'San Francisco, CA';
    this.data.company = 'Test Company';
    this.data.website = 'https://example.com';
    this.data.githubUsername = 'testuser';
    this.data.talentScore = 85;
    this.data.isPublic = true;
    return this;
  }

  /**
   * Build the user profile
   */
  build(): UserProfile {
    if (!this.data.id || !this.data.slug || !this.data.displayName || !this.data.walletAddress) {
      throw new Error('Missing required user fields');
    }
    return this.data as UserProfile;
  }

  /**
   * Build multiple users
   */
  buildMany(count: number): UserProfile[] {
    return Array.from({ length: count }, (_, i) => {
      this.data.id = `test-user-${i + 1}`;
      this.data.slug = `test-user-${i + 1}`;
      this.data.displayName = `Test User ${i + 1}`;
      return this.build();
    });
  }
}

/**
 * Create a new user builder
 */
export function aUser(): UserBuilder {
  return new UserBuilder();
}

