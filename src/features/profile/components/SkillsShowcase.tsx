'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Code, Star, Edit } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  yearsUsed?: number
  verified: boolean
}

interface SkillsShowcaseProps {
  skills: Skill[]
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: () => void
}

export function SkillsShowcase({
  skills,
  isOwner = false,
  onAdd,
  onEdit,
}: SkillsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(skills.map(s => s.category)))
  const filteredSkills = selectedCategory
    ? skills.filter(s => s.category === selectedCategory)
    : skills

  // Group skills by proficiency level
  const groupedSkills = {
    expert: filteredSkills.filter(s => s.proficiency >= 80),
    proficient: filteredSkills.filter(s => s.proficiency >= 60 && s.proficiency < 80),
    intermediate: filteredSkills.filter(s => s.proficiency >= 40 && s.proficiency < 60),
    beginner: filteredSkills.filter(s => s.proficiency < 40),
  }

  const SkillBadge = ({ skill }: { skill: Skill }) => {
    const getProficiencyColor = (proficiency: number) => {
      if (proficiency >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300'
      if (proficiency >= 60) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300'
      if (proficiency >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300'
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300'
    }

    return (
      <div
        className={`px-3 py-2 rounded-lg border ${getProficiencyColor(skill.proficiency)} flex items-center gap-2`}
      >
        <span className="font-medium">{skill.name}</span>
        {skill.verified && (
          <Star className="w-3 h-3 fill-current" title="Verified" />
        )}
        {skill.yearsUsed && (
          <span className="text-xs opacity-70">
            {skill.yearsUsed}y
          </span>
        )}
      </div>
    )
  }

  if (skills.length === 0 && !isOwner) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          <h3 className="text-xl font-semibold">Skills</h3>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            {onEdit && (
              <Button onClick={onEdit} size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Manage
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            )}
          </div>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No skills added yet
        </p>
      ) : (
        <>
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({skills.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category} ({skills.filter(s => s.category === category).length})
                </button>
              ))}
            </div>
          )}

          {/* Skills grouped by proficiency */}
          <div className="space-y-6">
            {groupedSkills.expert.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">
                  Expert Level ({groupedSkills.expert.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills.expert.map(skill => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {groupedSkills.proficient.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  Proficient ({groupedSkills.proficient.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills.proficient.map(skill => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {groupedSkills.intermediate.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">
                  Intermediate ({groupedSkills.intermediate.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills.intermediate.map(skill => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {groupedSkills.beginner.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Learning ({groupedSkills.beginner.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills.beginner.map(skill => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Expert (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Proficient (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Intermediate (40-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Learning (0-39%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 fill-current" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

