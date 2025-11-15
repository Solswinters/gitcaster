'use client'

import { useState, useEffect } from 'react'
import { Eye, TrendingUp, TrendingDown, Users, Globe, ExternalLink } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface AnalyticsData {
  totalViews: number
  viewsInPeriod: number
  viewChange: number
  viewChangePercentage: number
  uniqueVisitors: number
  viewsByDay: Array<{ date: string; views: number }>
  viewsByCountry: Array<{ country: string; views: number }>
  viewsByReferrer: Array<{ referrer: string; views: number }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/profile?period=${period}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile Analytics</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Views</h3>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.viewsInPeriod.toLocaleString()}</div>
          <div className={`flex items-center text-sm ${
            data.viewChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.viewChange >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(data.viewChangePercentage)}% from last period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.uniqueVisitors.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {data.uniqueVisitors > 0 ? 
              `${(data.viewsInPeriod / data.uniqueVisitors).toFixed(1)} views per visitor` :
              'No visitors yet'
            }
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</h3>
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold mb-1">{data.totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            All time
          </div>
        </div>
      </div>

      {/* Views Over Time Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.viewsByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
            />
            <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
          {data.viewsByCountry.length > 0 ? (
            <div className="space-y-3">
              {data.viewsByCountry.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCountryFlag(item.country)}</span>
                    <span className="font-medium">{item.country || 'Unknown'}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{item.views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No country data yet</p>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          {data.viewsByReferrer.length > 0 ? (
            <div className="space-y-3">
              {data.viewsByReferrer.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{formatReferrer(item.referrer)}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{item.views}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No referrer data yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

function getCountryFlag(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function formatReferrer(referrer: string | null): string {
  if (!referrer) return 'Direct'
  try {
    const url = new URL(referrer)
    return url.hostname.replace('www.', '')
  } catch {
    return referrer
  }
}

