'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Star,
  GitBranch,
  Code,
  Users,
  TrendingUp,
  Calendar,
  Target,
} from 'lucide-react'

interface CareerTimelineProps {
  userId?: string
}

export function CareerTimeline({ userId }: CareerTimelineProps) {
  const [loading, setLoading] = useState(true)
  const [trajectory, setTrajectory] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([])

  useEffect(() => {
    async function fetchCareerData() {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)

        const response = await fetch(`/api/analytics/career?${params}`)
        const data = await response.json()

        if (data.error) {
          console.error('Error fetching career data:', data.error)
          return
        }

        setTrajectory(data.trajectory)
        setMilestones(data.milestones || [])
      } catch (error) {
        console.error('Failed to fetch career data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCareerData()
  }, [userId])

  if (loading) {
    return <CareerTimelineSkeleton />
  }

  if (!trajectory) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Unable to load career data. Please try again.
          </p>
        </CardContent>
      </Card>
    )
  }

  const currentStage = trajectory.currentStage
  const projectedNext = trajectory.projectedNextStage

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4" />
      case 'recognition':
        return <Star className="h-4 w-4" />
      case 'contribution':
        return <GitBranch className="h-4 w-4" />
      case 'skill':
        return <Code className="h-4 w-4" />
      case 'leadership':
        return <Users className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Stage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Career Stage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold capitalize">
                {currentStage.stage} Developer
              </h3>
              <p className="text-sm text-muted-foreground">
                Since {new Date(currentStage.startDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              Level {trajectory.stages.length}
            </Badge>
          </div>

          {/* Stage Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentStage.indicators).map(([key, value]: [string, any]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-bold">{value}</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>

          {/* Strength & Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm font-medium mb-2">Strength Areas</p>
              <div className="flex flex-wrap gap-2">
                {trajectory.strengthAreas.map((area: string) => (
                  <Badge key={area} variant="default">
                    {area.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Growth Opportunities</p>
              <div className="flex flex-wrap gap-2">
                {trajectory.improvementAreas.map((area: string) => (
                  <Badge key={area} variant="outline">
                    {area.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage Projection */}
      {projectedNext && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Next Stage: {projectedNext.stage}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Timeline</p>
                <p className="text-lg font-semibold">
                  {new Date(projectedNext.estimatedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{projectedNext.progress}%</p>
              </div>
            </div>

            <Progress value={projectedNext.progress} className="h-3" />

            <div>
              <p className="text-sm font-medium mb-2">Requirements</p>
              <ul className="space-y-1">
                {projectedNext.requirements.map((req: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestones Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Career Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {milestones.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keep coding! Milestones will appear as you progress.
            </p>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getMilestoneIcon(milestone.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <Badge variant={getImpactColor(milestone.impact) as any}>
                        {milestone.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{milestone.category}</span>
                      <span>•</span>
                      <span>
                        {new Date(milestone.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Growth Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Growth Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {trajectory.overallGrowthRate.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">points/year</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Average skill improvement across all areas
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CareerTimelineSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

