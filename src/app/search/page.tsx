'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters, SearchFiltersState } from '@/components/search/SearchFilters'
import { SearchResults } from '@/components/search/SearchResults'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, X } from 'lucide-react'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<SearchFiltersState>({
    skills: searchParams.get('skills')?.split(',').filter(Boolean) || [],
    languages: searchParams.get('languages')?.split(',').filter(Boolean) || [],
    location: searchParams.get('location') || '',
    experienceLevel: searchParams.get('experienceLevel')?.split(',').filter(Boolean) || [],
    minYears: searchParams.get('minYears') ? parseInt(searchParams.get('minYears')!) : null,
    maxYears: searchParams.get('maxYears') ? parseInt(searchParams.get('maxYears')!) : null,
    minScore: searchParams.get('minScore') ? parseFloat(searchParams.get('minScore')!) : null,
    featured: searchParams.get('featured') === 'true',
    hasGitHub: searchParams.get('hasGitHub') === 'true',
    hasTalentProtocol: searchParams.get('hasTalentProtocol') === 'true',
  })
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (filters.skills.length) params.set('skills', filters.skills.join(','))
        if (filters.languages.length) params.set('languages', filters.languages.join(','))
        if (filters.location) params.set('location', filters.location)
        if (filters.experienceLevel.length) params.set('experienceLevel', filters.experienceLevel.join(','))
        if (filters.minYears !== null) params.set('minYears', filters.minYears.toString())
        if (filters.maxYears !== null) params.set('maxYears', filters.maxYears.toString())
        if (filters.minScore !== null) params.set('minScore', filters.minScore.toString())
        if (filters.featured) params.set('featured', 'true')
        if (filters.hasGitHub) params.set('hasGitHub', 'true')
        if (filters.hasTalentProtocol) params.set('hasTalentProtocol', 'true')
        params.set('sortBy', sortBy)
        params.set('page', page.toString())

        const response = await fetch(`/api/search?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, filters, sortBy, page])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (filters.skills.length) params.set('skills', filters.skills.join(','))
    if (filters.location) params.set('location', filters.location)
    if (filters.experienceLevel.length) params.set('experienceLevel', filters.experienceLevel.join(','))
    if (sortBy !== 'relevance') params.set('sortBy', sortBy)
    if (page !== 1) params.set('page', page.toString())

    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [query, filters, sortBy, page, router])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setPage(1)
  }

  const handleFiltersChange = (newFilters: SearchFiltersState) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Find Developers</h1>
          <div className="flex items-center gap-4">
            <SearchBar
              onSearch={handleSearch}
              initialQuery={query}
              placeholder="Search by name, skills, or location..."
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="w-80 flex-shrink-0">
              <div className="sticky top-4">
                <SearchFilters filters={filters} onChange={handleFiltersChange} />
              </div>
            </aside>
          )}

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Sort options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="activity">Recent Activity</option>
                  <option value="score">Talent Score</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              {results && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {results.pagination.totalCount} developers found
                </p>
              )}
            </div>

            {/* Results */}
            {results && (
              <SearchResults
                profiles={results.profiles}
                pagination={results.pagination}
                isLoading={isLoading}
                onPageChange={handlePageChange}
              />
            )}

            {!results && isLoading && (
              <SearchResults
                profiles={[]}
                pagination={{ page: 1, pageSize: 20, totalCount: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false }}
                isLoading={true}
                onPageChange={() => {}}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

