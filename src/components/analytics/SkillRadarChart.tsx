'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Target } from 'lucide-react'

interface SkillRadarChartProps {
  data: Array<{
    skill: string
    value: number
    category: string
  }>
  title?: string
  description?: string
  maxValue?: number
}

export function SkillRadarChart({
  data,
  title = 'Skill Profile',
  description = 'Your expertise across different skill areas',
  maxValue = 100,
}: SkillRadarChartProps) {
  // Group by category and calculate average
  const categoryData = data.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { sum: 0, count: 0 }
      }
      acc[item.category].sum += item.value
      acc[item.category].count += 1
      return acc
    },
    {} as Record<string, { sum: number; count: number }>
  )

  const chartData = Object.entries(categoryData).map(([category, { sum, count }]) => ({
    category,
    value: Math.round(sum / count),
    fullMark: maxValue,
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No skill data available yet. Add skills to your profile!
          </div>
        ) : (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis
                  dataKey="category"
                  className="text-xs"
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, maxValue]}
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Radar
                  name="Skill Level"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Skill breakdown */}
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {chartData.map((item) => (
              <div key={item.category} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">{item.category}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

