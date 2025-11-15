'use client'

import { useState } from 'react'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export interface SearchFiltersState {
  skills: string[]
  languages: string[]
  location: string
  experienceLevel: string[]
  minYears: number | null
  maxYears: number | null
  minScore: number | null
  featured: boolean
  hasGitHub: boolean
  hasTalentProtocol: boolean
}

interface SearchFiltersProps {
  filters: SearchFiltersState
  onChange: (filters: SearchFiltersState) => void
}

const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6+ years)' },
  { value: 'lead', label: 'Lead/Principal (10+ years)' },
]

const POPULAR_SKILLS = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Go', 'Rust', 'Java', 'Kotlin',
  'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB',
]

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const [expanded, setExpanded] = useState({
    experience: true,
    skills: true,
    location: true,
    other: false,
  })

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleExperienceLevelToggle = (level: string) => {
    const newLevels = filters.experienceLevel.includes(level)
      ? filters.experienceLevel.filter(l => l !== level)
      : [...filters.experienceLevel, level]
    onChange({ ...filters, experienceLevel: newLevels })
  }

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill]
    onChange({ ...filters, skills: newSkills })
  }

  const clearFilters = () => {
    onChange({
      skills: [],
      languages: [],
      location: '',
      experienceLevel: [],
      minYears: null,
      maxYears: null,
      minScore: null,
      featured: false,
      hasGitHub: false,
      hasTalentProtocol: false,
    })
  }

  const activeFilterCount = 
    filters.skills.length +
    filters.languages.length +
    (filters.location ? 1 : 0) +
    filters.experienceLevel.length +
    (filters.minYears !== null ? 1 : 0) +
    (filters.maxYears !== null ? 1 : 0) +
    (filters.minScore !== null ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.hasGitHub ? 1 : 0) +
    (filters.hasTalentProtocol ? 1 : 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Experience Level */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('experience')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          <span>Experience Level</span>
          {expanded.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.experience && (
          <div className="space-y-2 mt-2">
            {EXPERIENCE_LEVELS.map(level => (
              <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.experienceLevel.includes(level.value)}
                  onCheckedChange={() => handleExperienceLevelToggle(level.value)}
                />
                <span className="text-sm">{level.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('skills')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          <span>Skills</span>
          {expanded.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.skills && (
          <div className="space-y-2 mt-2">
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    filters.skills.includes(skill)
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          <span>Location</span>
          {expanded.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.location && (
          <div className="mt-2">
            <Input
              type="text"
              placeholder="e.g., San Francisco, Remote"
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Other Filters */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('other')}
          className="flex items-center justify-between w-full py-2 font-medium"
        >
          <span>Other Filters</span>
          {expanded.other ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.other && (
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Years of Experience</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minYears || ''}
                  onChange={(e) => onChange({ ...filters, minYears: e.target.value ? parseInt(e.target.value) : null })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxYears || ''}
                  onChange={(e) => onChange({ ...filters, maxYears: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Min Talent Score</label>
              <Input
                type="number"
                placeholder="e.g., 50"
                value={filters.minScore || ''}
                onChange={(e) => onChange({ ...filters, minScore: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.featured}
                onCheckedChange={(checked) => onChange({ ...filters, featured: !!checked })}
              />
              <span className="text-sm">Featured developers only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.hasGitHub}
                onCheckedChange={(checked) => onChange({ ...filters, hasGitHub: !!checked })}
              />
              <span className="text-sm">Has GitHub profile</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.hasTalentProtocol}
                onCheckedChange={(checked) => onChange({ ...filters, hasTalentProtocol: !!checked })}
              />
              <span className="text-sm">Has Talent Protocol score</span>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

