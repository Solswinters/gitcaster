import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/monitoring/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics/search
 * Get search analytics and trends
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d

    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    // Get search query statistics
    const [totalSearches, popularQueries, queryTrends] = await Promise.all([
      // Total searches in period
      prisma.searchQuery.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),

      // Most popular search queries
      prisma.searchQuery.groupBy({
        by: ['query'],
        where: {
          createdAt: {
            gte: startDate,
          },
          query: {
            not: '',
          },
        },
        _count: {
          query: true,
        },
        orderBy: {
          _count: {
            query: 'desc',
          },
        },
        take: 10,
      }),

      // Daily search trends
      prisma.$queryRaw<Array<{ date: Date; count: number }>>`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "SearchQuery"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ])

    // Get top skills searched
    const skillSearches = await prisma.searchQuery.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        filters: true,
      },
    })

    // Extract skills from filters
    const skillCounts: Record<string, number> = {}
    skillSearches.forEach((search: any) => {
      const filters = search.filters as any
      if (filters?.skills && Array.isArray(filters.skills)) {
        filters.skills.forEach((skill: string) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
      }
    })

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    // Average results per search
    const avgResults = await prisma.searchQuery.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _avg: {
        results: true,
      },
    })

    return NextResponse.json({
      period,
      totalSearches,
      avgResults: avgResults._avg.results || 0,
      popularQueries: popularQueries.map(q => ({
        query: q.query,
        count: q._count.query,
      })),
      topSkills,
      trends: queryTrends.map(t => ({
        date: t.date,
        count: Number(t.count),
      })),
    })
  } catch (error) {
    logger.error('Failed to get search analytics', error as Error)
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 })
  }
}

/**
 * POST /api/analytics/search
 * Track a search event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters, resultCount, clickedProfileId } = body

    // Log the search event
    await prisma.searchQuery.create({
      data: {
        query: query || '',
        filters: filters || {},
        results: resultCount || 0,
      },
    })

    // If user clicked a profile, track that too
    if (clickedProfileId) {
      await prisma.profile.update({
        where: { id: clickedProfileId },
        data: {
          viewCount: {
            increment: 1,
          },
          lastActiveAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to track search event', error as Error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

