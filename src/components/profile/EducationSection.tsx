'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, GraduationCap, Calendar, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface Education {
  id: string
  institution: string
  degree: string
  field?: string
  description?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
}

interface EducationSectionProps {
  education: Education[]
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function EducationSection({
  education,
  isOwner = false,
  onAdd,
  onEdit,
  onDelete,
}: EducationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const formatDateRange = (start: Date, end?: Date, isCurrent?: boolean) => {
    const startStr = format(new Date(start), 'yyyy')
    const endStr = isCurrent ? 'Present' : end ? format(new Date(end), 'yyyy') : 'Present'
    return `${startStr} - ${endStr}`
  }

  if (education.length === 0 && !isOwner) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          <h3 className="text-xl font-semibold">Education</h3>
        </div>
        {isOwner && onAdd && (
          <Button onClick={onAdd} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        )}
      </div>

      {education.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No education added yet
        </p>
      ) : (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className={`relative ${index !== education.length - 1 ? 'pb-6 border-b border-gray-200 dark:border-gray-700' : ''}`}
            >
              <div className="flex gap-4">
                {/* Institution Logo Placeholder */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {edu.institution.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{edu.degree}</h4>
                      <p className="text-gray-700 dark:text-gray-300">{edu.institution}</p>
                      {edu.field && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.field}</p>
                      )}
                    </div>
                    
                    {isOwner && (
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(edu.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(edu.id)}
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
                      <span>{formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}</span>
                    </div>
                    {edu.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                        Current
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <div>
                      <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${expandedId === edu.id ? '' : 'line-clamp-3'}`}>
                        {edu.description}
                      </p>
                      {edu.description.length > 200 && (
                        <button
                          onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                        >
                          {expandedId === edu.id ? 'Show less' : 'Show more'}
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

