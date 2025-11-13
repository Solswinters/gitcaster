'use client'

import Link from 'next/link'
import { SearchBar } from '@/components/search/SearchBar'
import { FeaturedDevelopers } from '@/components/search/FeaturedDevelopers'
import { Button } from '@/components/ui/button'
import { Search, Users, TrendingUp, Award, Code, Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'

const POPULAR_SEARCHES = [
  { label: 'React Developers', query: 'React', icon: Code },
  { label: 'Senior Engineers', filters: 'experienceLevel=senior', icon: Award },
  { label: 'Remote Talent', query: 'remote', icon: Users },
  { label: 'Full Stack Developers', query: 'Full Stack', icon: TrendingUp },
  { label: 'Frontend Specialists', query: 'Frontend', icon: Code },
  { label: 'Backend Engineers', query: 'Backend', icon: Briefcase },
]

const FEATURED_SKILLS = [
  'TypeScript', 'React', 'Next.js', 'Node.js', 'Python',
  'Go', 'Rust', 'Docker', 'Kubernetes', 'AWS',
  'PostgreSQL', 'MongoDB', 'GraphQL', 'REST API', 'Microservices',
]

export default function DiscoverPage() {
  const router = useRouter()

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleQuickSearch = (query: string, filters?: string) => {
    if (filters) {
      router.push(`/search?${filters}`)
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleSkillSearch = (skill: string) => {
    router.push(`/search?skills=${encodeURIComponent(skill)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Discover Top Developers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Find and connect with talented developers based on their GitHub activity and on-chain credentials
          </p>
          
          <div className="flex justify-center mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by name, skills, location..."
              autoFocus
            />
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="gap-2">
                <Search className="w-5 h-5" />
                Advanced Search
              </Button>
            </Link>
            <Link href="/search?featured=true">
              <Button size="lg" variant="outline" className="gap-2">
                <Award className="w-5 h-5" />
                Featured Developers
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Search Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Popular Searches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_SEARCHES.map((search) => (
              <button
                key={search.label}
                onClick={() => handleQuickSearch(search.query || '', search.filters)}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <search.icon className="w-6 h-6 text-blue-600" />
                <span className="font-medium">{search.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Skills */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Browse by Skill</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {FEATURED_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillSearch(skill)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Developers */}
        <div className="mb-12">
          <FeaturedDevelopers />
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Developers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500K+</div>
              <div className="text-gray-600 dark:text-gray-400">GitHub Contributions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-400">Companies Hiring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

