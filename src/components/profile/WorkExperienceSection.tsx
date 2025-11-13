'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Briefcase, Calendar, MapPin, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface WorkExperience {
  id: string
  company: string
  position: string
  description?: string
  location?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
}

interface WorkExperienceSectionProps {
  experiences: WorkExperience[]
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function WorkExperienceSection({
  experiences,
  isOwner = false,
  onAdd,
  onEdit,
  onDelete,
}: WorkExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const formatDateRange = (start: Date, end?: Date, isCurrent?: boolean) => {
    const startStr = format(new Date(start), 'MMM yyyy')
    const endStr = isCurrent ? 'Present' : end ? format(new Date(end), 'MMM yyyy') : 'Present'
    return `${startStr} - ${endStr}`
  }

  const calculateDuration = (start: Date, end?: Date, isCurrent?: boolean) => {
    const endDate = isCurrent || !end ? new Date() : new Date(end)
    const months = (endDate.getFullYear() - new Date(start).getFullYear()) * 12 + 
                   (endDate.getMonth() - new Date(start).getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  }

  if (experiences.length === 0 && !isOwner) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          <h3 className="text-xl font-semibold">Work Experience</h3>
        </div>
        {isOwner && onAdd && (
          <Button onClick={onAdd} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        )}
      </div>

      {experiences.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No work experience added yet
        </p>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`relative ${index !== experiences.length - 1 ? 'pb-6 border-b border-gray-200 dark:border-gray-700' : ''}`}
            >
              <div className="flex gap-4">
                {/* Company Logo Placeholder */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {exp.company.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{exp.position}</h4>
                      <p className="text-gray-700 dark:text-gray-300">{exp.company}</p>
                    </div>
                    
                    {isOwner && (
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(exp.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(exp.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                      <span className="ml-1">({calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)})</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                        Current
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <div>
                      <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${expandedId === exp.id ? '' : 'line-clamp-3'}`}>
                        {exp.description}
                      </p>
                      {exp.description.length > 200 && (
                        <button
                          onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                        >
                          {expandedId === exp.id ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

