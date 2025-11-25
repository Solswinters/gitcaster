import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'

import { PredictiveAnalytics } from '@/lib/analytics/predictive-analytics'
import { logError, logInfo } from '@/lib/logging/structured-logger'
import { sessionOptions } from '@/lib/session/config'

/**
 * GET /api/analytics/predict
 * Get predictive analytics and forecasts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions)
    
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const predictionType = searchParams.get('type') || 'growth'

    // Mock historical data - would come from database
    const historicalData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (11 - i))
      return {
        date,
        metrics: {
          commits: 50 + Math.random() * 30,
          codeQuality: 70 + Math.random() * 15,
          stars: 10 + i * 5,
        },
      }
    })

    if (predictionType === 'growth') {
      const predictions = PredictiveAnalytics.predictGrowth(
        historicalData,
        ['commits', 'codeQuality', 'stars']
      )

      logInfo('Growth predictions generated', {
        userId: session.user.id,
        metricsCount: predictions.length,
      })

      return NextResponse.json({ predictions })
    }

    if (predictionType === 'career') {
      const currentMetrics = {
        commits: 500,
        stars: 100,
        prs: 200,
      }

      const careerPrediction = PredictiveAnalytics.predictCareerMilestones(
        currentMetrics,
        5.5, // growth rate
        'mid'
      )

      logInfo('Career predictions generated', {
        userId: session.user.id,
      })

      return NextResponse.json({ prediction: careerPrediction })
    }

    return NextResponse.json({ error: 'Invalid prediction type' }, { status: 400 })
  } catch (error) {
    logError('Failed to generate predictions', error as Error)
    return NextResponse.json({ error: 'Failed to generate predictions' }, { status: 500 })
  }
}

