'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Search, Users, Target } from 'lucide-react'

export function SearchPerformance() {
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/search?period=7d')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
    }

    fetchAnalytics()
  }, [])

  if (!analytics) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Search Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Searches</span>
          </div>
          <div className="text-2xl font-bold">{analytics.totalSearches.toLocaleString()}</div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Results</span>
          </div>
          <div className="text-2xl font-bold">{Math.round(analytics.avgResults)}</div>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Popular Skills</span>
          </div>
          <div className="text-2xl font-bold">{analytics.topSkills.length}</div>
        </div>
      </div>

      {analytics.popularQueries.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Popular Searches</h4>
          <div className="space-y-2">
            {analytics.popularQueries.slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{item.query}</span>
                <span className="text-gray-500">{item.count} searches</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analytics.topSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Trending Skills</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.topSkills.slice(0, 8).map((item: any, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
              >
                {item.skill} ({item.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

