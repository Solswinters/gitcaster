/**
 * Profile type definitions
 */

export interface Profile {
  id: string;
  userId: string;
  githubUsername: string;
  displayName?: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  socialLinks: SocialLinks;
  stats?: ProfileStats;
  preferences?: ProfilePreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  blog?: string;
  stackoverflow?: string;
}

export interface ProfileStats {
  commits: number;
  pullRequests: number;
  issues: number;
  repositories: number;
  stars: number;
  followers: number;
  following: number;
  contributions: number;
}

export interface ProfilePreferences {
  theme: 'light' | 'dark' | 'system';
  publicEmail: boolean;
  publicPhone: boolean;
  showStats: boolean;
  showActivity: boolean;
  emailNotifications: boolean;
}

export interface Repository {
  id: string;
  name: string;
  description?: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  updatedAt: Date;
  createdAt: Date;
}

