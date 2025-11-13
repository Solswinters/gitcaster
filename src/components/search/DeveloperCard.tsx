'use client'

import Link from 'next/link'
import { MapPin, Star, GitBranch, GitPullRequest, Trophy } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DeveloperCardProps {
  profile: {
    slug: string
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    location: string | null
    experienceLevel: string | null
    yearsOfExperience: number | null
    talentScore: number | null
    isFeatured: boolean
    user: {
      githubUsername: string | null
      githubStats: Array<{
        totalCommits: number | null
        totalPRs: number | null
        languages: any
        publicRepos: number | null
      }>
    }
    skills: Array<{
      proficiency: number
      skill: {
        name: string
        category: string
      }
    }>
  }
}

export function DeveloperCard({ profile }: DeveloperCardProps) {
  const githubStats = profile.user.githubStats[0]
  const topSkills = profile.skills.slice(0, 5)

  return (
    <Link
      href={`/profile/${profile.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
    >
      {profile.isFeatured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          FEATURED
        </div>
      )}

      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-gray-100 dark:ring-gray-700">
          <AvatarImage src={profile.avatarUrl || undefined} alt={profile.displayName || 'Developer'} />
          <AvatarFallback>{profile.displayName?.charAt(0) || profile.user.githubUsername?.charAt(0) || 'D'}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="text-lg font-semibold truncate">
                {profile.displayName || profile.user.githubUsername}
              </h3>
              {profile.user.githubUsername && (
                <p className="text-sm text-gray-500">@{profile.user.githubUsername}</p>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
            )}
            {profile.experienceLevel && (
              <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs capitalize">
                {profile.experienceLevel}
              </div>
            )}
            {profile.yearsOfExperience !== null && (
              <div className="text-xs">
                {profile.yearsOfExperience}+ years exp
              </div>
            )}
            {profile.talentScore && (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                {profile.talentScore.toFixed(0)}
              </div>
            )}
          </div>

          {topSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {topSkills.map((skill) => (
                <span
                  key={skill.skill.name}
                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                >
                  {skill.skill.name}
                </span>
              ))}
            </div>
          )}

          {githubStats && (
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {githubStats.totalCommits !== null && (
                <div className="flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  {githubStats.totalCommits.toLocaleString()} commits
                </div>
              )}
              {githubStats.totalPRs !== null && (
                <div className="flex items-center gap-1">
                  <GitPullRequest className="w-4 h-4" />
                  {githubStats.totalPRs} PRs
                </div>
              )}
              {githubStats.publicRepos !== null && (
                <div className="text-xs">
                  {githubStats.publicRepos} repos
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

