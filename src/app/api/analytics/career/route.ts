import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'

import { CareerProgressionTracker } from '@/lib/analytics/career-progression'
import { logError, logInfo } from '@/lib/logging/structured-logger'
import { prisma } from '@/lib/db/prisma'
import { sessionOptions } from '@/lib/session/config'

/**
 * GET /api/analytics/career
 * Get career progression analysis
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

    // Verify user has access to this data
    if (userId !== session.user.id) {
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

    // Fetch comprehensive user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        githubStats: true,
        repositories: {
          orderBy: { createdAt: 'asc' },
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
            workExperience: {
              orderBy: { startDate: 'asc' },
            },
            education: {
              orderBy: { startDate: 'asc' },
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

    // Prepare data for career progression analysis
    const commits = [] as Array<{ date: Date; language: string }>
    const prs = [] as Array<{ date: Date; reviews: number }>
    const repos = user.repositories.map((repo) => ({
      created: repo.createdAt,
      stars: repo.stars || 0,
      role: repo.isOwner ? 'owner' : 'contributor',
    }))

    const skills = user.profile?.skills.map((s) => ({
      skill: s.skill.name,
      firstUsed: new Date(), // Would come from historical data
      lastUsed: new Date(),
    })) || []

    // Analyze progression
    const trajectory = CareerProgressionTracker.analyzeProgression({
      commits,
      prs,
      repos,
      skills,
    })

    // Get skill progressions
    const skillProgressions = user.profile?.skills.map((userSkill) => {
      // Mock activity data - would come from real tracking
      const activities = Array.from({ length: 20 }, (_, i) => ({
        date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
        type: 'commit' as const,
        complexity: Math.floor(Math.random() * 10),
      }))

      return CareerProgressionTracker.trackSkillProgression(
        userSkill.skill.name,
        activities
      )
    }) || []

    // Get milestones
    const milestones = CareerProgressionTracker.extractMilestones({
      commits,
      prs,
      repos,
      skills,
    })

    logInfo('Career progression analyzed', {
      userId,
      currentStage: trajectory.currentStage.stage,
      milestonesCount: milestones.length,
    })

    return NextResponse.json({
      trajectory,
      skillProgressions,
      milestones,
      workExperience: user.profile?.workExperience || [],
      education: user.profile?.education || [],
      metadata: {
        analyzedAt: new Date().toISOString(),
        yearsActive: trajectory.stages.length > 0 
          ? (Date.now() - trajectory.stages[0].startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
          : 0,
      },
    })
  } catch (error) {
    logError('Failed to analyze career progression', error as Error, {
      endpoint: '/api/analytics/career',
    })

    return NextResponse.json(
      { error: 'Failed to analyze career progression' },
      { status: 500 }
    )
  }
}

