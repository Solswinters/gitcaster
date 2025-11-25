import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

/**
 * Health check endpoint
 * Returns service status and dependencies health
 */
export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      memory: 'unknown',
    },
  }

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    checks.checks.database = 'healthy'
  } catch (error) {
    checks.status = 'unhealthy'
    checks.checks.database = 'unhealthy'
  }

  // Check memory usage
  const memUsage = process.memoryUsage()
  const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024)
  const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024)
  const memPercentage = (memUsedMB / memTotalMB) * 100

  checks.checks.memory = memPercentage < 90 ? 'healthy' : 'warning'

  const statusCode = checks.status === 'healthy' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}

