'use client'

import { Check, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CompletionItem {
  id: string
  label: string
  completed: boolean
  required: boolean
  action?: () => void
}

interface ProfileCompletionChecklistProps {
  items: CompletionItem[]
  onDismiss?: () => void
}

export function ProfileCompletionChecklist({
  items,
  onDismiss,
}: ProfileCompletionChecklistProps) {
  const totalItems = items.length
  const completedItems = items.filter(i => i.completed).length
  const requiredItems = items.filter(i => i.required).length
  const completedRequired = items.filter(i => i.required && i.completed).length
  const completionPercentage = Math.round((completedItems / totalItems) * 100)

  const isFullyComplete = completedItems === totalItems
  const isRequiredComplete = completedRequired === requiredItems

  if (isFullyComplete && onDismiss) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-6 h-6" />
              <h3 className="text-xl font-bold">Profile Complete! 🎉</h3>
            </div>
            <p>Your profile is fully set up and ready to impress recruiters.</p>
          </div>
          <Button variant="ghost" onClick={onDismiss} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Complete Your Profile</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRequiredComplete
              ? 'Great! All required fields are complete.'
              : `${requiredItems - completedRequired} required item${requiredItems - completedRequired !== 1 ? 's' : ''} remaining`}
          </p>
        </div>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">{completedItems} of {totalItems} completed</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              item.completed
                ? 'bg-green-50 dark:bg-green-900/20'
                : item.required
                ? 'bg-orange-50 dark:bg-orange-900/20'
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                item.completed
                  ? 'bg-green-600'
                  : item.required
                  ? 'bg-orange-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {item.completed ? (
                  <Check className="w-3 h-3 text-white" />
                ) : item.required ? (
                  <AlertCircle className="w-3 h-3 text-white" />
                ) : null}
              </div>
              <span className={`text-sm ${item.completed ? 'line-through opacity-70' : ''}`}>
                {item.label}
                {item.required && !item.completed && (
                  <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">Required</span>
                )}
              </span>
            </div>
            {!item.completed && item.action && (
              <Button size="sm" variant="ghost" onClick={item.action}>
                Complete
              </Button>
            )}
          </div>
        ))}
      </div>

      {!isRequiredComplete && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Complete required items to make your profile visible to recruiters.
          </p>
        </div>
      )}
    </div>
  )
}

