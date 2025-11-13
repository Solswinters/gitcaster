'use client'

import { useState } from 'react'
import { Tooltip } from '@/components/ui/tooltip'

interface ContributionDay {
  date: string
  count: number
  level: number // 0-4
}

interface ContributionCalendarProps {
  contributions: ContributionDay[]
  username: string
}

export function ContributionCalendar({ contributions, username }: ContributionCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null)

  // Group contributions by week
  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []

  contributions.forEach((day, index) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800'
      case 1: return 'bg-green-200 dark:bg-green-900'
      case 2: return 'bg-green-400 dark:bg-green-700'
      case 3: return 'bg-green-600 dark:bg-green-500'
      case 4: return 'bg-green-800 dark:bg-green-300'
      default: return 'bg-gray-100 dark:bg-gray-800'
    }
  }

  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0)
  const maxDay = contributions.reduce((max, day) => Math.max(max, day.count), 0)
  const avgDay = Math.round(totalContributions / contributions.length)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Contribution Activity</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalContributions.toLocaleString()} contributions in the last year
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} cursor-pointer transition-transform hover:scale-125`}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <strong>{hoveredDay.count}</strong> contributions on{' '}
          {new Date(hoveredDay.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold">{maxDay}</span> max/day
          </div>
          <div>
            <span className="font-semibold">{avgDay}</span> avg/day
          </div>
        </div>
      </div>
    </div>
  )
}

