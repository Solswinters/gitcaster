/**
 * Search query builder for developer profiles
 * Supports filtering by skills, location, experience, etc.
 */

import { Prisma } from '@prisma/client'

export interface SearchFilters {
  query?: string
  skills?: string[]
  languages?: string[]
  location?: string
  experienceLevel?: string[]
  minYearsExperience?: number
  maxYearsExperience?: number
  minTalentScore?: number
  isFeatured?: boolean
  hasGitHub?: boolean
  hasTalentProtocol?: boolean
  sortBy?: 'relevance' | 'activity' | 'score' | 'experience'
  sortOrder?: 'asc' | 'desc'
}

export class SearchQueryBuilder {
  private filters: SearchFilters

  constructor(filters: SearchFilters = {}) {
    this.filters = filters
  }

  /**
   * Build Prisma where clause from filters
   */
  buildWhereClause(): Prisma.ProfileWhereInput {
    const where: Prisma.ProfileWhereInput = {
      isPublic: true,
    }

    // Text search in name, bio, and tags
    if (this.filters.query) {
      where.OR = [
        {
          displayName: {
            contains: this.filters.query,
            mode: 'insensitive',
          },
        },
        {
          bio: {
            contains: this.filters.query,
            mode: 'insensitive',
          },
        },
        {
          searchTags: {
            hasSome: [this.filters.query.toLowerCase()],
          },
        },
        {
          user: {
            githubUsername: {
              contains: this.filters.query,
              mode: 'insensitive',
            },
          },
        },
      ]
    }

    // Location filter
    if (this.filters.location) {
      where.location = {
        contains: this.filters.location,
        mode: 'insensitive',
      }
    }

    // Experience level filter
    if (this.filters.experienceLevel && this.filters.experienceLevel.length > 0) {
      where.experienceLevel = {
        in: this.filters.experienceLevel,
      }
    }

    // Years of experience filter
    if (this.filters.minYearsExperience !== undefined || this.filters.maxYearsExperience !== undefined) {
      where.yearsOfExperience = {}
      
      if (this.filters.minYearsExperience !== undefined) {
        where.yearsOfExperience.gte = this.filters.minYearsExperience
      }
      
      if (this.filters.maxYearsExperience !== undefined) {
        where.yearsOfExperience.lte = this.filters.maxYearsExperience
      }
    }

    // Talent score filter
    if (this.filters.minTalentScore !== undefined) {
      where.talentScore = {
        gte: this.filters.minTalentScore,
      }
    }

    // Featured filter
    if (this.filters.isFeatured) {
      where.isFeatured = true
    }

    // Skills filter
    if (this.filters.skills && this.filters.skills.length > 0) {
      where.skills = {
        some: {
          skill: {
            name: {
              in: this.filters.skills,
            },
          },
        },
      }
    }

    // Has GitHub account
    if (this.filters.hasGitHub) {
      where.user = {
        githubUsername: {
          not: null,
        },
      }
    }

    // Has Talent Protocol score
    if (this.filters.hasTalentProtocol) {
      where.talentScore = {
        not: null,
      }
    }

    return where
  }

  /**
   * Build Prisma orderBy clause from sort options
   */
  buildOrderByClause(): Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[] {
    const sortOrder = this.filters.sortOrder || 'desc'

    switch (this.filters.sortBy) {
      case 'activity':
        return { lastActiveAt: sortOrder }
      
      case 'score':
        return { talentScore: sortOrder }
      
      case 'experience':
        return { yearsOfExperience: sortOrder }
      
      case 'relevance':
      default:
        // For relevance, prioritize featured, then score, then activity
        return [
          { isFeatured: 'desc' },
          { talentScore: 'desc' },
          { lastActiveAt: 'desc' },
        ]
    }
  }

  /**
   * Build full query with pagination
   */
  buildQuery(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize

    return {
      where: this.buildWhereClause(),
      orderBy: this.buildOrderByClause(),
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            githubUsername: true,
            githubStats: {
              select: {
                totalCommits: true,
                totalPRs: true,
                languages: true,
                publicRepos: true,
              },
            },
          },
        },
        skills: {
          include: {
            skill: true,
          },
          orderBy: {
            proficiency: 'desc',
          },
          take: 10,
        },
      },
    }
  }
}

/**
 * Helper function to create search query
 */
export function createSearchQuery(filters: SearchFilters, page: number = 1, pageSize: number = 20) {
  const builder = new SearchQueryBuilder(filters)
  return builder.buildQuery(page, pageSize)
}

