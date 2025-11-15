'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'

interface SkillTrendChartProps {
  data: Array<{
    period: string
    value: number
    skill: string
  }>
  title?: string
  description?: string
}

export function SkillTrendChart({
  data,
  title = 'Skill Progression Over Time',
  description = 'Track your skill development and usage patterns',
}: SkillTrendChartProps) {
  // Group data by skill
  const skillGroups = data.reduce(
    (acc, item) => {
      if (!acc[item.skill]) {
        acc[item.skill] = []
      }
      acc[item.skill].push({ period: item.period, value: item.value })
      return acc
    },
    {} as Record<string, Array<{ period: string; value: number }>>
  )

  // Get unique periods
  const periods = Array.from(new Set(data.map((d) => d.period))).sort()

  // Format data for recharts
  const chartData = periods.map((period) => {
    const dataPoint: any = { period }
    Object.keys(skillGroups).forEach((skill) => {
      const skillData = skillGroups[skill].find((d) => d.period === period)
      dataPoint[skill] = skillData?.value || 0
    })
    return dataPoint
  })

  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No trend data available yet. Keep coding to see your progress!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="period"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              {Object.keys(skillGroups).map((skill, index) => (
                <Line
                  key={skill}
                  type="monotone"
                  dataKey={skill}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

