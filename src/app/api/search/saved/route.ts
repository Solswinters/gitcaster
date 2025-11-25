import { NextRequest, NextResponse } from 'next/server'

import { getSession } from '@/lib/session'
import { logger } from '@/lib/monitoring/logger'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/search/saved
 * Get user's saved searches
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const savedSearches = await prisma.searchQuery.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    })

    return NextResponse.json({ savedSearches })
  } catch (error) {
    logger.error('Failed to get saved searches', error as Error)
    return NextResponse.json({ error: 'Failed to get saved searches' }, { status: 500 })
  }
}

/**
 * POST /api/search/saved
 * Save a search query
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { query, filters } = body

    const savedSearch = await prisma.searchQuery.create({
      data: {
        query: query || '',
        filters: filters || {},
        results: 0,
        userId: session.userId,
      },
    })

    return NextResponse.json({ savedSearch })
  } catch (error) {
    logger.error('Failed to save search', error as Error)
    return NextResponse.json({ error: 'Failed to save search' }, { status: 500 })
  }
}

/**
 * DELETE /api/search/saved/:id
 * Delete a saved search
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
      return NextResponse.json({ error: 'Search ID required' }, { status: 400 })
    }

    // Verify ownership
    const search = await prisma.searchQuery.findUnique({
      where: { id },
    })

    if (!search || search.userId !== session.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.searchQuery.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete saved search', error as Error)
    return NextResponse.json({ error: 'Failed to delete search' }, { status: 500 })
  }
}

