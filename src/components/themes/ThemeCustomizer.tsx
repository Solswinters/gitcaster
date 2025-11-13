'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ThemeConfig, FONT_OPTIONS, LAYOUT_OPTIONS, BACKGROUND_PATTERNS } from '@/lib/themes/presets'
import { Palette, Type, Layout, Image } from 'lucide-react'

interface ThemeCustomizerProps {
  theme: ThemeConfig
  onChange: (theme: ThemeConfig) => void
}

export function ThemeCustomizer({ theme, onChange }: ThemeCustomizerProps) {
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'layout' | 'background'>('colors')

  const handleColorChange = (field: keyof ThemeConfig, value: string) => {
    onChange({ ...theme, [field]: value })
  }

  const handleChange = (field: keyof ThemeConfig, value: any) => {
    onChange({ ...theme, [field]: value })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Customize Theme</h3>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'colors', label: 'Colors', icon: Palette },
          { id: 'typography', label: 'Typography', icon: Type },
          { id: 'layout', label: 'Layout', icon: Layout },
          { id: 'background', label: 'Background', icon: Image },
        ].map(section => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{section.label}</span>
            </button>
          )
        })}
      </div>

      {/* Colors Section */}
      {activeSection === 'colors' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="primaryColor"
                type="color"
                value={theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="secondaryColor"
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="accentColor"
                type="color"
                value={theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="backgroundColor"
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="textColor"
                type="color"
                value={theme.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={theme.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Typography Section */}
      {activeSection === 'typography' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="fontFamily">Font Family</Label>
            <select
              id="fontFamily"
              value={theme.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="fontSize">Font Size</Label>
            <select
              id="fontSize"
              value={theme.fontSize}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="sm">Small</option>
              <option value="base">Base</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
      )}

      {/* Layout Section */}
      {activeSection === 'layout' && (
        <div className="space-y-4">
          {LAYOUT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleChange('layout', option.value)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                theme.layout === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold mb-1">{option.label}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Background Section */}
      {activeSection === 'background' && (
        <div className="space-y-4">
          <div>
            <Label>Background Pattern</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {BACKGROUND_PATTERNS.map(pattern => (
                <button
                  key={pattern.value}
                  onClick={() => handleChange('backgroundPattern', pattern.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    theme.backgroundPattern === pattern.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{pattern.preview}</div>
                  <div className="text-sm font-medium">{pattern.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

