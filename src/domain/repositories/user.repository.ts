/**
 * User Repository Interface
 * 
 * Defines the contract for user data access operations.
 */

import type { UserProfile } from '../entities';

export interface IUserRepository {
  /**
   * Find a user by their ID
   */
  findById(id: string): Promise<UserProfile | null>;

  /**
   * Find a user by their wallet address
   */
  findByWalletAddress(address: string): Promise<UserProfile | null>;

  /**
   * Find a user by their slug
   */
  findBySlug(slug: string): Promise<UserProfile | null>;

  /**
   * Create a new user profile
   */
  create(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile>;

  /**
   * Update an existing user profile
   */
  update(id: string, data: Partial<UserProfile>): Promise<UserProfile>;

  /**
   * Delete a user profile
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a slug is available
   */
  isSlugAvailable(slug: string): Promise<boolean>;

  /**
   * Increment view count for a profile
   */
  incrementViewCount(id: string): Promise<void>;
}

