import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/monitoring/logger'

export const dynamic = 'force-dynamic'

/**
 * POST /api/profile/theme
 * Apply a theme to user's profile
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { themeId } = body

    if (!themeId) {
      return NextResponse.json({ error: 'Theme ID required' }, { status: 400 })
    }

    // Verify theme exists
    const theme = await prisma.profileTheme.findUnique({
      where: { id: themeId },
    })

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Update profile with theme
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.userId },
      data: {
        themeId,
      },
      include: {
        theme: true,
      },
    })

    // Increment theme usage count
    await prisma.profileTheme.update({
      where: { id: themeId },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    logger.error('Failed to apply theme', error as Error)
    return NextResponse.json({ error: 'Failed to apply theme' }, { status: 500 })
  }
}

/**
 * DELETE /api/profile/theme
 * Remove theme from profile (reset to default)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.update({
      where: { userId: session.userId },
      data: {
        themeId: null,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    logger.error('Failed to remove theme', error as Error)
    return NextResponse.json({ error: 'Failed to remove theme' }, { status: 500 })
  }
}

