import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/monitoring/logger'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics/profile
 * Get profile analytics for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, all
    
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Calculate date range
    const now = new Date()
    let startDate: Date
    if (period === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (period === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    } else {
      startDate = profile.createdAt
    }

    // Get view statistics
    const [totalViews, viewsInPeriod, viewsByDay, viewsByCountry, viewsByReferrer, uniqueVisitors] = await Promise.all([
      // Total views
      prisma.profileView.count({
        where: { profileId: profile.id },
      }),

      // Views in period
      prisma.profileView.count({
        where: {
          profileId: profile.id,
          createdAt: { gte: startDate },
        },
      }),

      // Views by day
      prisma.$queryRaw<Array<{ date: Date; count: number }>>`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "ProfileView"
        WHERE profile_id = ${profile.id}
          AND created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,

      // Views by country
      prisma.profileView.groupBy({
        by: ['viewerCountry'],
        where: {
          profileId: profile.id,
          createdAt: { gte: startDate },
          viewerCountry: { not: null },
        },
        _count: true,
        orderBy: {
          _count: {
            viewerCountry: 'desc',
          },
        },
        take: 10,
      }),

      // Views by referrer
      prisma.profileView.groupBy({
        by: ['referrer'],
        where: {
          profileId: profile.id,
          createdAt: { gte: startDate },
          referrer: { not: null },
        },
        _count: true,
        orderBy: {
          _count: {
            referrer: 'desc',
          },
        },
        take: 10,
      }),

      // Unique visitors (by IP hash)
      prisma.profileView.findMany({
        where: {
          profileId: profile.id,
          createdAt: { gte: startDate },
        },
        distinct: ['ipHash'],
        select: { ipHash: true },
      }),
    ])

    // Calculate previous period for comparison
    const periodLength = now.getTime() - startDate.getTime()
    const previousStartDate = new Date(startDate.getTime() - periodLength)
    const viewsInPreviousPeriod = await prisma.profileView.count({
      where: {
        profileId: profile.id,
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    })

    const viewChange = viewsInPeriod - viewsInPreviousPeriod
    const viewChangePercentage = viewsInPreviousPeriod > 0
      ? Math.round((viewChange / viewsInPreviousPeriod) * 100)
      : 100

    return NextResponse.json({
      period,
      totalViews,
      viewsInPeriod,
      viewChange,
      viewChangePercentage,
      uniqueVisitors: uniqueVisitors.length,
      viewsByDay: viewsByDay.map(v => ({
        date: v.date,
        views: Number(v.count),
      })),
      viewsByCountry: viewsByCountry.map(v => ({
        country: v.viewerCountry,
        views: v._count,
      })),
      viewsByReferrer: viewsByReferrer.map(v => ({
        referrer: v.referrer,
        views: v._count,
      })),
    })
  } catch (error) {
    logger.error('Failed to get profile analytics', error as Error)
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 })
  }
}

/**
 * POST /api/analytics/profile
 * Track a profile view
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileSlug, referrer } = body

    if (!profileSlug) {
      return NextResponse.json({ error: 'Profile slug required' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { slug: profileSlug },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get visitor information
    const userAgent = request.headers.get('user-agent') || undefined
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0'
    const ipHash = createHash('sha256').update(ip).digest('hex')

    // Geo-location headers (from CDN or proxy)
    const country = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country') || undefined
    const region = request.headers.get('x-vercel-ip-country-region') || undefined
    const city = request.headers.get('x-vercel-ip-city') || undefined

    // Create view record
    await prisma.profileView.create({
      data: {
        profileId: profile.id,
        viewerCountry: country,
        viewerRegion: region,
        viewerCity: city,
        referrer: referrer || undefined,
        userAgent,
        ipHash,
      },
    })

    // Increment view count
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        viewCount: { increment: 1 },
        lastActiveAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to track profile view', error as Error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}

