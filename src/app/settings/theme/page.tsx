'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemePicker } from '@/components/themes/ThemePicker'
import { ThemeCustomizer } from '@/components/themes/ThemeCustomizer'
import { ThemePreview } from '@/components/themes/ThemePreview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PRESET_THEMES, ThemeConfig } from '@/lib/themes/presets'
import { Save, RotateCcw, Download, Share2, Loader2 } from 'lucide-react'

export default function ThemeSettingsPage() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(PRESET_THEMES[0])
  const [customThemes, setCustomThemes] = useState<any[]>([])
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [themeName, setThemeName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetchProfile()
    fetchCustomThemes()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile/me')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        
        // Load current theme if set
        if (data.profile.theme) {
          setSelectedTheme(data.profile.theme)
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const fetchCustomThemes = async () => {
    try {
      const response = await fetch('/api/themes?type=my')
      if (response.ok) {
        const data = await response.json()
        setCustomThemes(data.themes || [])
      }
    } catch (error) {
      console.error('Failed to fetch custom themes:', error)
    }
  }

  const handleSaveTheme = async () => {
    if (!themeName.trim()) {
      alert('Please enter a theme name')
      return
    }

    setIsSaving(true)
    try {
      // Save custom theme
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: {
            ...selectedTheme,
            name: themeName,
          },
          isPublic: false,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCustomThemes([...customThemes, data.theme])
        setThemeName('')
        alert('Theme saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save theme:', error)
      alert('Failed to save theme')
    } finally {
      setIsSaving(false)
    }
  }

  const handleApplyTheme = async () => {
    setIsSaving(true)
    try {
      // If it's a custom theme with ID, apply it
      if (selectedTheme.id) {
        const response = await fetch('/api/profile/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeId: selectedTheme.id }),
        })

        if (response.ok) {
          alert('Theme applied successfully!')
          router.refresh()
        }
      } else {
        // For preset themes, save as custom first then apply
        await handleSaveTheme()
      }
    } catch (error) {
      console.error('Failed to apply theme:', error)
      alert('Failed to apply theme')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetTheme = () => {
    setSelectedTheme(PRESET_THEMES[0])
    setIsCustomizing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Theme</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your profile's appearance with preset themes or create your own
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Theme Selection and Customization */}
          <div className="space-y-6">
            <ThemePicker
              selectedTheme={selectedTheme}
              onSelect={(theme) => {
                setSelectedTheme(theme)
                setIsCustomizing(false)
              }}
              customThemes={customThemes}
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Actions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomizing(!isCustomizing)}
                >
                  {isCustomizing ? 'Hide Customizer' : 'Customize'}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleApplyTheme}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Apply Theme
                </Button>
                <Button variant="outline" onClick={handleResetTheme}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {isCustomizing && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Label htmlFor="themeName">Save as Custom Theme</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="themeName"
                      placeholder="My Custom Theme"
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                    />
                    <Button onClick={handleSaveTheme} disabled={isSaving || !themeName.trim()}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {isCustomizing && (
              <ThemeCustomizer theme={selectedTheme} onChange={setSelectedTheme} />
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="sticky top-4">
            <ThemePreview theme={selectedTheme} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}

