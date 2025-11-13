'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Star,
  GitPullRequest,
  Code,
  Award,
} from 'lucide-react'

interface MetricsOverviewProps {
  userId?: string
  includeBenchmarks?: boolean
}

interface Metric {
  label: string
  value: number
  change?: number
  percentile?: number
  unit?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function MetricsOverview({ userId, includeBenchmarks = false }: MetricsOverviewProps) {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any>(null)
  const [benchmarks, setBenchmarks] = useState<any>(null)
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        if (includeBenchmarks) params.append('includeBenchmarks', 'true')

        const response = await fetch(`/api/analytics/metrics?${params}`)
        const data = await response.json()

        if (data.error) {
          console.error('Error fetching metrics:', data.error)
          return
        }

        setMetrics(data.metrics)
        setBenchmarks(data.benchmarks)
        setInsights(data.insights || [])
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [userId, includeBenchmarks])

  if (loading) {
    return <MetricsOverviewSkeleton />
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Unable to load metrics. Please try again.
          </p>
        </CardContent>
      </Card>
    )
  }

  const displayMetrics: Metric[] = [
    {
      label: 'Commit Frequency',
      value: metrics.commitFrequency,
      unit: '/week',
      icon: <Activity className="h-4 w-4" />,
      percentile: benchmarks?.commitFrequency?.percentile,
      trend: metrics.commitFrequency > 10 ? 'up' : 'neutral',
    },
    {
      label: 'PR Velocity',
      value: metrics.prVelocity,
      unit: '/month',
      icon: <GitPullRequest className="h-4 w-4" />,
      percentile: benchmarks?.prVelocity?.percentile,
      trend: metrics.prVelocity > 5 ? 'up' : 'neutral',
    },
    {
      label: 'Code Quality Score',
      value: metrics.codeQualityScore,
      unit: '/100',
      icon: <Code className="h-4 w-4" />,
      percentile: benchmarks?.codeQualityScore?.percentile,
      trend: metrics.codeQualityScore > 70 ? 'up' : 'down',
    },
    {
      label: 'Collaboration Score',
      value: metrics.collaborationScore,
      unit: '/100',
      icon: <Users className="h-4 w-4" />,
      percentile: benchmarks?.collaborationScore?.percentile,
      trend: metrics.collaborationScore > 60 ? 'up' : 'neutral',
    },
    {
      label: 'Issue Resolution',
      value: metrics.issueResolutionRate,
      unit: '%',
      icon: <Award className="h-4 w-4" />,
      percentile: benchmarks?.issueResolutionRate?.percentile,
      trend: metrics.issueResolutionRate > 75 ? 'up' : 'down',
    },
    {
      label: 'GitHub Stars',
      value: metrics.repoStars,
      icon: <Star className="h-4 w-4" />,
      percentile: benchmarks?.repoStars?.percentile,
      trend: metrics.repoStars > 50 ? 'up' : 'neutral',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Insights Section */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {metric.icon}
                    <span>{metric.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {typeof metric.value === 'number'
                        ? metric.value.toFixed(1)
                        : metric.value}
                    </span>
                    {metric.unit && (
                      <span className="text-sm text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                  {metric.percentile !== undefined && (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          metric.percentile > 75
                            ? 'default'
                            : metric.percentile > 50
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        Top {100 - metric.percentile}%
                      </Badge>
                    </div>
                  )}
                </div>
                {metric.trend && (
                  <div className="flex-shrink-0">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Growth & Impact Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Skill Diversity</p>
              <p className="text-2xl font-bold">{metrics.skillDiversity}</p>
              <p className="text-xs text-muted-foreground">languages</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Review Participation</p>
              <p className="text-2xl font-bold">
                {metrics.codeReviewParticipation.toFixed(1)}x
              </p>
              <p className="text-xs text-muted-foreground">ratio</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Community Engagement</p>
              <p className="text-2xl font-bold">{metrics.communityEngagement}</p>
              <p className="text-xs text-muted-foreground">score</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Repository Forks</p>
              <p className="text-2xl font-bold">{metrics.forks}</p>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricsOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

