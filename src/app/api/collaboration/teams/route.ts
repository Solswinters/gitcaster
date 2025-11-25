import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'

import { sessionOptions } from '@/lib/session/config'

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions)
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock teams data
    const teams = [
      {
        id: '1',
        name: 'Frontend Team',
        members: [
          { id: '1', name: 'Alice', role: 'owner' },
          { id: '2', name: 'Bob', role: 'member' },
        ],
      },
    ]

    return NextResponse.json({ teams })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions)
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    // Create team logic here

    return NextResponse.json({ success: true, teamId: `team-${Date.now()}` })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}

