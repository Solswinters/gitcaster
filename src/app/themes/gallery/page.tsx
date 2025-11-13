'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PRESET_THEMES } from '@/lib/themes/presets'
import { Button } from '@/components/ui/button'
import { Eye, Download, Heart, TrendingUp, Clock } from 'lucide-react'

export default function ThemeGalleryPage() {
  const router = useRouter()
  const [publicThemes, setPublicThemes] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular')

  useEffect(() => {
    fetchPublicThemes()
  }, [])

  const fetchPublicThemes = async () => {
    try {
      const response = await fetch('/api/themes?type=public')
      if (response.ok) {
        const data = await response.json()
        setPublicThemes(data.public || [])
      }
    } catch (error) {
      console.error('Failed to fetch public themes:', error)
    }
  }

  const handleUseTheme = async (themeId: string) => {
    try {
      const response = await fetch('/api/profile/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      })

      if (response.ok) {
        alert('Theme applied successfully!')
        router.push('/settings/theme')
      } else {
        alert('Please sign in to use this theme')
        router.push('/auth/signin')
      }
    } catch (error) {
      console.error('Failed to apply theme:', error)
    }
  }

  const ThemeCard = ({ theme, isPreset = false }: { theme: any; isPreset?: boolean }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Theme Preview */}
      <div
        className="h-32 p-4 flex items-end"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
        }}
      >
        <div className="text-white">
          <div className="text-sm opacity-90">Theme Preview</div>
          <div className="font-bold text-lg">{theme.name}</div>
        </div>
      </div>

      {/* Theme Info */}
      <div className="p-4">
        {theme.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {theme.description}
          </p>
        )}

        {/* Color Swatches */}
        <div className="flex gap-2 mb-4">
          <div
            className="w-10 h-10 rounded border border-gray-300"
            style={{ backgroundColor: theme.primaryColor }}
            title="Primary"
          />
          <div
            className="w-10 h-10 rounded border border-gray-300"
            style={{ backgroundColor: theme.secondaryColor }}
            title="Secondary"
          />
          <div
            className="w-10 h-10 rounded border border-gray-300"
            style={{ backgroundColor: theme.accentColor }}
            title="Accent"
          />
        </div>

        {/* Stats */}
        {!isPreset && theme.usageCount !== undefined && (
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {theme.usageCount}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isPreset ? (
            <Link href="/settings/theme" className="flex-1">
              <Button className="w-full" size="sm">
                Use Theme
              </Button>
            </Link>
          ) : (
            <Button
              className="flex-1"
              size="sm"
              onClick={() => handleUseTheme(theme.id)}
            >
              Use Theme
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Theme Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and discover themes for your developer profile
          </p>
        </div>

        {/* Preset Themes Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Preset Themes</h2>
            <Link href="/settings/theme">
              <Button variant="outline">
                Customize Your Own
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRESET_THEMES.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} isPreset />
            ))}
          </div>
        </div>

        {/* Community Themes Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Community Themes</h2>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('popular')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Popular
              </Button>
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('recent')}
              >
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </Button>
            </div>
          </div>

          {publicThemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">No Community Themes Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to share your custom theme with the community!
              </p>
              <Link href="/settings/theme">
                <Button>Create Your Theme</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

