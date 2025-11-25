import { NextRequest, NextResponse } from 'next/server'

import { getSession } from '@/lib/session'
import { logger } from '@/lib/monitoring/logger'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/profile/education
 * Get all education for user's profile
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
        education: {
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

    return NextResponse.json({ education: profile.education })
  } catch (error) {
    logger.error('Failed to get education', error as Error)
    return NextResponse.json({ error: 'Failed to get education' }, { status: 500 })
  }
}

/**
 * POST /api/profile/education
 * Add new education
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
    const { institution, degree, field, description, startDate, endDate, isCurrent } = body

    if (!institution || !degree || !startDate) {
      return NextResponse.json(
        { error: 'Institution, degree, and start date are required' },
        { status: 400 }
      )
    }

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        institution,
        degree,
        field: field || null,
        description: description || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
      },
    })

    return NextResponse.json({ education })
  } catch (error) {
    logger.error('Failed to create education', error as Error)
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}

/**
 * PATCH /api/profile/education/:id
 * Update education
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
      return NextResponse.json({ error: 'Education ID required' }, { status: 400 })
    }

    const body = await request.json()
    
    // Verify ownership
    const existing = await prisma.education.findUnique({
      where: { id },
      include: { profile: true },
    })

    if (!existing || existing.profile.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    const education = await prisma.education.update({
      where: { id },
      data: {
        institution: body.institution || existing.institution,
        degree: body.degree || existing.degree,
        field: body.field || null,
        description: body.description || null,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent !== undefined ? body.isCurrent : existing.isCurrent,
      },
    })

    return NextResponse.json({ education })
  } catch (error) {
    logger.error('Failed to update education', error as Error)
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 })
  }
}

/**
 * DELETE /api/profile/education/:id
 * Delete education
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
      return NextResponse.json({ error: 'Education ID required' }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.education.findUnique({
      where: { id },
      include: { profile: true },
    })

    if (!existing || existing.profile.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    await prisma.education.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete education', error as Error)
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
}

