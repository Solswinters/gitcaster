'use client'

import { useEffect, useState } from 'react'
import { DeveloperCard } from './DeveloperCard'
import { Loader2, Trophy } from 'lucide-react'

export function FeaturedDevelopers() {
  const [featured, setFeatured] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/search?featured=true&pageSize=3&sortBy=score')
        if (response.ok) {
          const data = await response.json()
          setFeatured(data.profiles)
        }
      } catch (error) {
        console.error('Failed to fetch featured developers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (featured.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-300 dark:border-yellow-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-600" />
        <h2 className="text-2xl font-bold">Featured Developers</h2>
      </div>
      
      <div className="grid gap-6">
        {featured.map((profile) => (
          <DeveloperCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  )
}

