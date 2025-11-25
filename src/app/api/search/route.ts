import { NextRequest, NextResponse } from 'next/server'

import { createSearchQuery, SearchFilters } from '@/lib/search/query-builder'
import { logger } from '@/lib/monitoring/logger'
import { prisma } from '@/lib/db/prisma'

/**
 * dynamic utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of dynamic.
 */
export const dynamic = 'force-dynamic'

/**
 * GET /api/search
 * Search for developer profiles with filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse filters from query parameters
    const filters: SearchFilters = {
      query: searchParams.get('q') || undefined,
      skills: searchParams.get('skills')?.split(',').filter(Boolean) || undefined,
      languages: searchParams.get('languages')?.split(',').filter(Boolean) || undefined,
      location: searchParams.get('location') || undefined,
      experienceLevel: searchParams.get('experienceLevel')?.split(',').filter(Boolean) || undefined,
      minYearsExperience: searchParams.get('minYears') ? parseInt(searchParams.get('minYears')!) : undefined,
      maxYearsExperience: searchParams.get('maxYears') ? parseInt(searchParams.get('maxYears')!) : undefined,
      minTalentScore: searchParams.get('minScore') ? parseFloat(searchParams.get('minScore')!) : undefined,
      isFeatured: searchParams.get('featured') === 'true',
      hasGitHub: searchParams.get('hasGitHub') === 'true',
      hasTalentProtocol: searchParams.get('hasTalentProtocol') === 'true',
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100)

    // Build and execute query
    const query = createSearchQuery(filters, page, pageSize)
    
    const [profiles, totalCount] = await Promise.all([
      prisma.profile.findMany(query),
      prisma.profile.count({ where: query.where }),
    ])

    // Log search query for analytics
    try {
      await prisma.searchQuery.create({
        data: {
          query: filters.query || '',
          filters: filters as any,
          results: totalCount,
        },
      })
    } catch (error) {
      logger.warn('Failed to log search query', { error })
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      profiles,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters,
    })
  } catch (error) {
    logger.error('Search API error', error as Error)
    
    return NextResponse.json(
      { error: 'Failed to search profiles' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/search/suggestions
 * Get search suggestions and autocomplete
 */
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Get matching skills
    const skills = await prisma.skill.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 5,
      select: {
        name: true,
        category: true,
      },
    })

    // Get matching locations (from existing profiles)
    const locations = await prisma.profile.groupBy({
      by: ['location'],
      where: {
        location: {
          contains: query,
          mode: 'insensitive',
        },
        isPublic: true,
      },
      _count: true,
      take: 5,
    })

    // Get matching usernames
    const users = await prisma.user.findMany({
      where: {
        githubUsername: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 5,
      select: {
        githubUsername: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({
      suggestions: {
        skills: skills.map(s => ({ type: 'skill', value: s.name, category: s.category })),
        locations: locations.map(l => ({ type: 'location', value: l.location, count: l._count })),
        users: users.map(u => ({
          type: 'user',
          value: u.githubUsername,
          displayName: u.profile?.displayName,
          avatarUrl: u.profile?.avatarUrl,
        })),
      },
    })
  } catch (error) {
    logger.error('Search suggestions error', error as Error)
    
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    )
  }
}

