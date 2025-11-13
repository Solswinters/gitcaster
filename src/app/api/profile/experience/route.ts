import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/monitoring/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/profile/experience
 * Get all work experience for user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      include: {
        workExperience: {
          orderBy: [
            { isCurrent: 'desc' },
            { startDate: 'desc' },
          ],
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ experience: profile.workExperience })
  } catch (error) {
    logger.error('Failed to get work experience', error as Error)
    return NextResponse.json({ error: 'Failed to get experience' }, { status: 500 })
  }
}

/**
 * POST /api/profile/experience
 * Add new work experience
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { company, position, description, location, startDate, endDate, isCurrent } = body

    if (!company || !position || !startDate) {
      return NextResponse.json(
        { error: 'Company, position, and start date are required' },
        { status: 400 }
      )
    }

    const experience = await prisma.workExperience.create({
      data: {
        profileId: profile.id,
        company,
        position,
        description: description || null,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
      },
    })

    return NextResponse.json({ experience })
  } catch (error) {
    logger.error('Failed to create work experience', error as Error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

/**
 * PATCH /api/profile/experience/:id
 * Update work experience
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 })
    }

    const body = await request.json()
    
    // Verify ownership
    const existing = await prisma.workExperience.findUnique({
      where: { id },
      include: { profile: true },
    })

    if (!existing || existing.profile.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    const experience = await prisma.workExperience.update({
      where: { id },
      data: {
        company: body.company,
        position: body.position,
        description: body.description || null,
        location: body.location || null,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent !== undefined ? body.isCurrent : existing.isCurrent,
      },
    })

    return NextResponse.json({ experience })
  } catch (error) {
    logger.error('Failed to update work experience', error as Error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

/**
 * DELETE /api/profile/experience/:id
 * Delete work experience
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.workExperience.findUnique({
      where: { id },
      include: { profile: true },
    })

    if (!existing || existing.profile.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    await prisma.workExperience.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete work experience', error as Error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}

