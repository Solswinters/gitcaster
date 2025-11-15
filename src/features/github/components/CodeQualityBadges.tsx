'use client'

import { Star, GitBranch, Users, TrendingUp, Award, Target } from 'lucide-react'

interface QualityMetrics {
  totalStars: number
  totalForks: number
  followers: number
  publicRepos: number
  totalContributions: number
  contributionStreak: number
}

interface CodeQualityBadgesProps {
  metrics: QualityMetrics
}

export function CodeQualityBadges({ metrics }: CodeQualityBadgesProps) {
  const badges = [
    {
      icon: Star,
      label: 'Stars Received',
      value: metrics.totalStars,
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      threshold: 100,
    },
    {
      icon: GitBranch,
      label: 'Repositories',
      value: metrics.publicRepos,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      threshold: 20,
    },
    {
      icon: Users,
      label: 'Followers',
      value: metrics.followers,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      threshold: 50,
    },
    {
      icon: TrendingUp,
      label: 'Contributions',
      value: metrics.totalContributions,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      threshold: 500,
    },
    {
      icon: Target,
      label: 'Forks',
      value: metrics.totalForks,
      color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      threshold: 50,
    },
    {
      icon: Award,
      label: 'Contribution Streak',
      value: metrics.contributionStreak,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      threshold: 30,
      suffix: ' days',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">GitHub Achievements</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon
          const isAchieved = badge.value >= badge.threshold

          return (
            <div
              key={index}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                isAchieved
                  ? `${badge.color} border-current`
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-400 border-gray-300 dark:border-gray-600 opacity-60'
              }`}
            >
              {isAchieved && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center text-white">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
              )}

              <Icon className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold mb-1">
                {badge.value.toLocaleString()}
                {badge.suffix || ''}
              </div>
              <div className="text-sm font-medium">{badge.label}</div>

              {!isAchieved && (
                <div className="text-xs mt-2 opacity-70">
                  Unlock at {badge.threshold.toLocaleString()}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Achievement Progress */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Achievement Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {badges.filter(b => b.value >= b.threshold).length} / {badges.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${(badges.filter(b => b.value >= b.threshold).length / badges.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

