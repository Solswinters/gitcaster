'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricsOverview } from '@/components/analytics/MetricsOverview'
import { CareerTimeline } from '@/components/analytics/CareerTimeline'
import { SkillTrendChart } from '@/components/analytics/SkillTrendChart'
import { ActivityHeatmap } from '@/components/analytics/ActivityHeatmap'
import { SkillRadarChart } from '@/components/analytics/SkillRadarChart'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw, TrendingUp, BarChart3, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Trigger data refresh
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    // Export analytics data
    console.log('Exporting analytics...')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and growth as a developer
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Career</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <MetricsOverview includeBenchmarks={true} />
        </TabsContent>

        {/* Career Tab */}
        <TabsContent value="career" className="space-y-6">
          <CareerTimeline />
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillTrendChart
              data={[
                { period: '2024-Q1', value: 60, skill: 'TypeScript' },
                { period: '2024-Q2', value: 75, skill: 'TypeScript' },
                { period: '2024-Q3', value: 85, skill: 'TypeScript' },
                { period: '2024-Q1', value: 40, skill: 'React' },
                { period: '2024-Q2', value: 65, skill: 'React' },
                { period: '2024-Q3', value: 80, skill: 'React' },
              ]}
            />
            <SkillRadarChart
              data={[
                { skill: 'TypeScript', value: 85, category: 'Languages' },
                { skill: 'React', value: 80, category: 'Frameworks' },
                { skill: 'Node.js', value: 75, category: 'Backend' },
                { skill: 'PostgreSQL', value: 70, category: 'Databases' },
                { skill: 'Docker', value: 65, category: 'DevOps' },
                { skill: 'Testing', value: 78, category: 'Quality' },
              ]}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skill Recommendations</CardTitle>
              <CardDescription>
                Based on market trends and your current skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    skill: 'Kubernetes',
                    priority: 'High',
                    demand: 88,
                    reason: 'Growing market demand in DevOps',
                  },
                  {
                    skill: 'GraphQL',
                    priority: 'Medium',
                    demand: 75,
                    reason: 'Complements your React expertise',
                  },
                  {
                    skill: 'Go',
                    priority: 'Medium',
                    demand: 72,
                    reason: 'Trending for backend services',
                  },
                ].map((rec) => (
                  <div
                    key={rec.skill}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <div className="font-semibold">{rec.skill}</div>
                      <div className="text-sm text-muted-foreground">{rec.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{rec.priority} Priority</div>
                      <div className="text-xs text-muted-foreground">
                        {rec.demand}% demand
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <ActivityHeatmap
            data={Array.from({ length: 365 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - (365 - i))
              return {
                date,
                value: Math.floor(Math.random() * 10),
                intensity: Math.floor(Math.random() * 100),
              }
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground mt-1">
                  +18% from last year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Longest Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42 days</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Current: 12 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Most Active Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Thursday</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average: 8 commits
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

