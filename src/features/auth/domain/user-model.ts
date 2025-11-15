/**
 * User domain model
 */

import type { User } from '../types';

export class UserModel {
  constructor(private user: User) {}

  get id(): string {
    return this.user.id;
  }

  get displayName(): string {
    return this.user.displayName || this.user.email?.split('@')[0] || 'Anonymous';
  }

  get hasEmail(): boolean {
    return !!this.user.email;
  }

  get hasWallet(): boolean {
    return !!this.user.walletAddress;
  }

  get hasGitHub(): boolean {
    return !!this.user.githubUsername;
  }

  getDaysSinceCreation(): number {
    const now = new Date();
    const created = this.user.createdAt;
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getDaysSinceLastLogin(): number | null {
    if (!this.user.lastLogin) return null;
    
    const now = new Date();
    const lastLogin = this.user.lastLogin;
    const diff = now.getTime() - lastLogin.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  toJSON(): User {
    return this.user;
  }
}

