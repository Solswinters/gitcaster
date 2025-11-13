'use client'

import { useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { PRESET_THEMES, ThemeConfig } from '@/lib/themes/presets'
import { Button } from '@/components/ui/button'

interface ThemePickerProps {
  selectedTheme?: ThemeConfig
  onSelect: (theme: ThemeConfig) => void
  customThemes?: any[]
}

export function ThemePicker({ selectedTheme, onSelect, customThemes = [] }: ThemePickerProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'public'>('presets')

  const isSelected = (theme: ThemeConfig) => {
    return selectedTheme?.id === theme.id ||
      (selectedTheme?.name === theme.name && !selectedTheme?.id)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Choose Theme</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'presets'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'custom'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Themes ({customThemes.length})
        </button>
        <button
          onClick={() => setActiveTab('public')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'public'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Community
        </button>
      </div>

      {/* Preset Themes */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme)}
              className={`relative p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                isSelected(theme)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              {isSelected(theme) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="mb-3">
                <h4 className="font-semibold mb-1">{theme.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{theme.description}</p>
              </div>

              {/* Color Preview */}
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.primaryColor }}
                  title="Primary"
                />
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.secondaryColor }}
                  title="Secondary"
                />
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.accentColor }}
                  title="Accent"
                />
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.backgroundColor }}
                  title="Background"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Custom Themes */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          {customThemes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No custom themes yet</p>
              <p className="text-sm mt-2">Create your own theme in the customizer</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onSelect(theme)}
                  className={`relative p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                    isSelected(theme)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isSelected(theme) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <h4 className="font-semibold mb-2">{theme.name}</h4>
                  <div className="flex gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: theme.secondaryColor }}
                    />
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Community Themes */}
      {activeTab === 'public' && (
        <div className="text-center py-8 text-gray-500">
          <p>Community themes coming soon!</p>
        </div>
      )}
    </div>
  )
}

