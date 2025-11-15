'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Activity } from 'lucide-react'

interface ActivityHeatmapProps {
  data: Array<{
    date: Date
    value: number
    intensity: number
  }>
  title?: string
  description?: string
}

export function ActivityHeatmap({
  data,
  title = 'Activity Calendar',
  description = 'Daily contribution activity over the past year',
}: ActivityHeatmapProps) {
  // Group data by week and day
  const weeks: Array<Array<{ date: Date; value: number; intensity: number } | null>> = []
  
  if (data.length > 0) {
    const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime())
    const startDate = sorted[0].date
    const endDate = sorted[sorted.length - 1].date || new Date()

    // Fill all days in the range
    const dateMap = new Map(data.map((d) => [d.date.toDateString(), d]))
    let currentWeek: Array<{ date: Date; value: number; intensity: number } | null> = []

    // Pad the start to align with Sunday
    const startDay = startDate.getDay()
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null)
    }

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toDateString()
      const dayData = dateMap.get(dateStr)

      currentWeek.push(
        dayData || {
          date: new Date(date),
          value: 0,
          intensity: 0,
        }
      )

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      weeks.push(currentWeek)
    }
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-muted'
    if (intensity < 25) return 'bg-green-200 dark:bg-green-900'
    if (intensity < 50) return 'bg-green-300 dark:bg-green-800'
    if (intensity < 75) return 'bg-green-400 dark:bg-green-700'
    return 'bg-green-500 dark:bg-green-600'
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {weeks.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No activity data available yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-1 min-w-full">
              {/* Day labels */}
              <div className="flex gap-1">
                <div className="w-8" /> {/* Spacer for day labels */}
                <div className="flex gap-1 flex-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => {
                        if (dayIndex === 0 && day && day.date.getDate() <= 7) {
                          return (
                            <div key={dayIndex} className="text-xs text-muted-foreground h-3 w-3">
                              {monthLabels[day.date.getMonth()]}
                            </div>
                          )
                        }
                        return <div key={dayIndex} className="h-3 w-3" />
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1">
                {/* Day labels column */}
                <div className="flex flex-col gap-1">
                  {dayLabels.map((label, index) => (
                    <div
                      key={label}
                      className={`text-xs text-muted-foreground h-3 w-8 flex items-center ${
                        index % 2 === 1 ? '' : 'opacity-0'
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex gap-1 flex-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`h-3 w-3 rounded-sm ${
                            day ? getIntensityColor(day.intensity) : 'bg-transparent'
                          }`}
                          title={
                            day
                              ? `${day.date.toLocaleDateString()}: ${day.value} contributions`
                              : ''
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-sm bg-muted" />
                  <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
                  <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-800" />
                  <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
                  <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

