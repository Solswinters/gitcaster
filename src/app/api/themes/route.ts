import { NextRequest, NextResponse } from 'next/server'

import { PRESET_THEMES, validateTheme, themeToDatabase } from '@/lib/themes/presets'
import { getSession } from '@/lib/session'
import { logger } from '@/lib/monitoring/logger'
import { prisma } from '@/lib/db/prisma'

/**
 * dynamic utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of dynamic.
 */
export const dynamic = 'force-dynamic'

/**
 * GET /api/themes
 * Get all available themes (presets and public themes)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'preset' | 'public' | 'my'

    if (type === 'preset') {
      return NextResponse.json({ themes: PRESET_THEMES })
    }

    if (type === 'my') {
      const session = await getSession()
      if (!session.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const myThemes = await prisma.profileTheme.findMany({
        where: {
          createdBy: session.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({ themes: myThemes })
    }

    // Get public themes
    const publicThemes = await prisma.profileTheme.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        usageCount: 'desc',
      },
      take: 50,
    })

    return NextResponse.json({
      presets: PRESET_THEMES,
      public: publicThemes,
    })
  } catch (error) {
    logger.error('Failed to get themes', error as Error)
    return NextResponse.json({ error: 'Failed to get themes' }, { status: 500 })
  }
}

/**
 * POST /api/themes
 * Create a new custom theme
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { theme, isPublic = false } = body

    // Validate theme
    const errors = validateTheme(theme)
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }

    // Create theme
    const newTheme = await prisma.profileTheme.create({
      data: {
        ...themeToDatabase(theme),
        createdBy: session.userId,
        isPublic,
        isPreset: false,
      },
    })

    return NextResponse.json({ theme: newTheme })
  } catch (error) {
    logger.error('Failed to create theme', error as Error)
    return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 })
  }
}

/**
 * PATCH /api/themes/:id
 * Update an existing theme
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
      return NextResponse.json({ error: 'Theme ID required' }, { status: 400 })
    }

    // Check ownership
    const existingTheme = await prisma.profileTheme.findUnique({
      where: { id },
    })

    if (!existingTheme || existingTheme.createdBy !== session.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    const body = await request.json()
    const { theme, isPublic } = body

    // Validate theme
    const errors = validateTheme(theme)
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }

    // Update theme
    const updatedTheme = await prisma.profileTheme.update({
      where: { id },
      data: {
        ...themeToDatabase(theme),
        isPublic: isPublic !== undefined ? isPublic : existingTheme.isPublic,
      },
    })

    return NextResponse.json({ theme: updatedTheme })
  } catch (error) {
    logger.error('Failed to update theme', error as Error)
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 })
  }
}

/**
 * DELETE /api/themes/:id
 * Delete a theme
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
      return NextResponse.json({ error: 'Theme ID required' }, { status: 400 })
    }

    // Check ownership
    const existingTheme = await prisma.profileTheme.findUnique({
      where: { id },
    })

    if (!existingTheme || existingTheme.createdBy !== session.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    // Delete theme
    await prisma.profileTheme.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete theme', error as Error)
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 })
  }
}

