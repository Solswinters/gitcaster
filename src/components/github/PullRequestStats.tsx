'use client'

import { GitPullRequest, Check, X, Clock, TrendingUp } from 'lucide-react'

interface PRStats {
  total: number
  merged: number
  open: number
  closed: number
  avgReviewTime: number // hours
}

interface PullRequestStatsProps {
  stats: PRStats
}

export function PullRequestStats({ stats }: PullRequestStatsProps) {
  const mergeRate = stats.total > 0 ? ((stats.merged / stats.total) * 100).toFixed(1) : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <GitPullRequest className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Pull Request Analytics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total PRs</div>
        </div>

        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.merged}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Merged</div>
        </div>

        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Open</div>
        </div>

        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.closed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Closed</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-medium">Merge Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{mergeRate}%</div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Avg Review Time</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.avgReviewTime}h
          </div>
        </div>
      </div>
    </div>
  )
}

