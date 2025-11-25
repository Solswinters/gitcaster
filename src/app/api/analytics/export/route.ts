import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'

import { ReportGenerator } from '@/lib/analytics/report-generator'
import { sessionOptions } from '@/lib/session/config'

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions)
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { format, reportType, data } = body

    if (!format || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const exported = ReportGenerator.exportReport(data, format)

    return new NextResponse(exported, {
      headers: {
        'Content-Type': format === 'json' ? 'application/json' : 'text/plain',
        'Content-Disposition': `attachment; filename=analytics-report.${format}`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

