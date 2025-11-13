import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/session/config'
import { prisma } from '@/lib/db/prisma'
import { MetricsCalculator } from '@/lib/analytics/metrics-calculator'
import { logError, logInfo } from '@/lib/logging/structured-logger'

/**
 * GET /api/analytics/metrics
 * Get comprehensive developer metrics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions)
    
    if (!session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id
    const includeHistory = searchParams.get('includeHistory') === 'true'

    // Verify user has access to this data
    if (userId !== session.user.id) {
      // Check if profile is public
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      })

      if (!targetUser?.profile?.isPublic) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        githubStats: true,
        repositories: {
          include: {
            languages: true,
          },
        },
        profile: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate activity timeframe
    const firstCommitDate = user.githubStats?.firstCommitAt || new Date()
    const now = new Date()
    const weeksActive = Math.ceil(
      (now.getTime() - firstCommitDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    )

    // Prepare data for metrics calculator
    const metricsData = {
      commits: user.githubStats?.totalCommits || 0,
      prs: user.githubStats?.totalPRs || 0,
      issues: user.githubStats?.totalIssues || 0,
      resolvedIssues: Math.floor((user.githubStats?.totalIssues || 0) * 0.75), // Estimate
      reviews: user.githubStats?.totalReviews || 0,
      receivedReviews: user.githubStats?.totalPRs || 0, // Estimate
      stars: user.repositories.reduce((sum, repo) => sum + (repo.stars || 0), 0),
      forks: user.repositories.reduce((sum, repo) => sum + (repo.forks || 0), 0),
      languages: user.profile?.skills.map((s) => s.skill.name) || [],
      weeksActive,
    }

    // Calculate metrics
    const metrics = MetricsCalculator.calculateDeveloperMetrics(metricsData)

    // Calculate benchmarks if requested
    let benchmarks
    if (searchParams.get('includeBenchmarks') === 'true') {
      // Fetch peer metrics (users with similar skill sets)
      const peerUsers = await prisma.user.findMany({
        where: {
          id: { not: userId },
          profile: {
            isPublic: true,
          },
        },
        include: {
          githubStats: true,
          repositories: true,
          profile: {
            include: {
              skills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },
        take: 100, // Sample size
      })

      const peerMetrics = peerUsers.map((peer) => {
        const peerWeeksActive = Math.ceil(
          (now.getTime() - (peer.githubStats?.firstCommitAt?.getTime() || now.getTime())) /
            (1000 * 60 * 60 * 24 * 7)
        )

        return MetricsCalculator.calculateDeveloperMetrics({
          commits: peer.githubStats?.totalCommits || 0,
          prs: peer.githubStats?.totalPRs || 0,
          issues: peer.githubStats?.totalIssues || 0,
          resolvedIssues: Math.floor((peer.githubStats?.totalIssues || 0) * 0.75),
          reviews: peer.githubStats?.totalReviews || 0,
          receivedReviews: peer.githubStats?.totalPRs || 0,
          stars: peer.repositories.reduce((sum, repo) => sum + (repo.stars || 0), 0),
          forks: peer.repositories.reduce((sum, repo) => sum + (repo.forks || 0), 0),
          languages: peer.profile?.skills.map((s) => s.skill.name) || [],
          weeksActive: peerWeeksActive,
        })
      })

      benchmarks = MetricsCalculator.calculateBenchmarks(metrics, peerMetrics)
    }

    // Generate insights
    const skillTrends: any[] = [] // Would be populated from historical data
    const insights = MetricsCalculator.generateInsights(metrics, skillTrends)

    // Fetch historical data if requested
    let history
    if (includeHistory) {
      // This would fetch from a time-series table or cache
      // For now, return empty array
      history = []
    }

    logInfo('Metrics calculated', {
      userId,
      metricType: 'developer_metrics',
      includeBenchmarks: !!benchmarks,
      includeHistory,
    })

    return NextResponse.json({
      metrics,
      benchmarks,
      insights,
      history,
      metadata: {
        calculatedAt: new Date().toISOString(),
        dataFreshness: user.githubStats?.updatedAt || null,
        weeksActive,
      },
    })
  } catch (error) {
    logError('Failed to calculate metrics', error as Error, {
      endpoint: '/api/analytics/metrics',
    })

    return NextResponse.json(
      { error: 'Failed to calculate metrics' },
      { status: 500 }
    )
  }
}

