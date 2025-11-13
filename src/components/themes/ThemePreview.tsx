'use client'

import { useEffect, useRef } from 'react'
import { ThemeConfig, applyTheme } from '@/lib/themes/presets'
import { GitBranch, Star, MapPin, Briefcase } from 'lucide-react'

interface ThemePreviewProps {
  theme: ThemeConfig
  profile?: {
    displayName?: string
    bio?: string
    location?: string
    company?: string
    avatarUrl?: string
  }
}

export function ThemePreview({ theme, profile }: ThemePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (previewRef.current) {
      // Apply theme styles only to preview container
      const css = `
        .theme-preview {
          background-color: ${theme.backgroundColor};
          color: ${theme.textColor};
          font-family: ${theme.fontFamily}, system-ui, sans-serif;
        }
        .theme-preview-primary {
          background-color: ${theme.primaryColor};
        }
        .theme-preview-secondary {
          background-color: ${theme.secondaryColor};
        }
        .theme-preview-accent {
          color: ${theme.accentColor};
        }
        .theme-preview-border {
          border-color: ${theme.textColor}20;
        }
      `
      
      const style = document.createElement('style')
      style.textContent = css
      previewRef.current.appendChild(style)
    }
  }, [theme])

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
        <h4 className="text-sm font-semibold mb-2">Theme Preview</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          This is how your profile will look with this theme
        </p>
      </div>

      <div
        ref={previewRef}
        className="theme-preview rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: `${theme.fontFamily}, system-ui, sans-serif`,
        }}
      >
        {/* Mock Profile Header */}
        <div
          className="p-6"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.displayName?.charAt(0) || 'J'}
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold">{profile?.displayName || 'John Doe'}</h3>
              <p className="opacity-90">@johndoe</p>
            </div>
          </div>
        </div>

        {/* Mock Profile Content */}
        <div className="p-6 space-y-4">
          {/* Bio */}
          <div>
            <p className="text-sm">
              {profile?.bio || 'Full-stack developer passionate about building great user experiences with modern web technologies.'}
            </p>
          </div>

          {/* Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span>{profile?.location || 'San Francisco, CA'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span>{profile?.company || 'Tech Company'}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${theme.primaryColor}15` }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <GitBranch className="w-4 h-4" style={{ color: theme.primaryColor }} />
              </div>
              <div className="text-lg font-bold" style={{ color: theme.primaryColor }}>
                1,234
              </div>
              <div className="text-xs opacity-70">Commits</div>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${theme.secondaryColor}15` }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4" style={{ color: theme.secondaryColor }} />
              </div>
              <div className="text-lg font-bold" style={{ color: theme.secondaryColor }}>
                567
              </div>
              <div className="text-xs opacity-70">Stars</div>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${theme.accentColor}15` }}
            >
              <div className="text-lg font-bold" style={{ color: theme.accentColor }}>
                89
              </div>
              <div className="text-xs opacity-70">Repos</div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-semibold mb-2">Top Skills</h4>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'React', 'Node.js', 'PostgreSQL'].map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`,
                    color: theme.primaryColor,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Button Example */}
          <button
            className="w-full py-2 px-4 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.primaryColor }}
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  )
}

