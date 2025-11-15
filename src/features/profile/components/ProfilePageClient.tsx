'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Building, Globe, Github, Twitter, Linkedin } from 'lucide-react';
import { RepositoryCard } from './RepositoryCard';

interface ProfilePageClientProps {
  profile: any;
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: '🎨 About Me', icon: '🎨' },
    { id: 'projects', label: '💼 Projects', icon: '💼' },
    { id: 'stats', label: '🎓 GitHub Stats', icon: '🎓' },
    { id: 'contact', label: '📧 Contact', icon: '📧' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || 'Profile'}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.displayName || profile.githubUsername}
                </h1>
                <p className="text-gray-600">Developer Profile</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">👨‍💻</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-gray-600 mb-6">
          {profile.bio || `Developer with ${profile.githubStats?.publicRepos || 0} public repositories and ${profile.githubStats?.totalCommits || 0} commits. Building amazing things with code.`}
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label.split(' ').slice(1).join(' ')}
            </button>
          ))}
        </div>

        {/* About Me Tab */}
        {activeTab === 'about' && (
          <div>
            <div className="flex gap-6 mb-8">
              <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-6xl">👨‍💻</span>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    Use this space to generally express yourself, your bold characteristics.
                    Keep it <span className="text-orange-500 font-semibold">simple</span> and{' '}
                    <span className="text-red-500 font-semibold">professional</span> – tell them about your hobbies and interests.
                    This will help them to understand a general summary of you.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Available on request</span>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`https://github.com/${profile.githubUsername}`} className="text-sm text-blue-600">
                    {profile.githubUsername}@github
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Talent Protocol Score */}
            {profile.talentScore && (
              <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">🏆 Talent Protocol Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-purple-600">{profile.talentScore}</span>
                    <span className="text-sm text-gray-600">Builder Score</span>
                  </div>
                  {profile.talentPassportData && (
                    <div className="mt-3 flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Activity: </span>
                        <span className="font-semibold">{profile.talentPassportData.activity_score}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Identity: </span>
                        <span className="font-semibold">{profile.talentPassportData.identity_score}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Skills: </span>
                        <span className="font-semibold">{profile.talentPassportData.skills_score}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profile.githubStats?.languages && profile.githubStats.languages.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Skills
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {profile.githubStats.languages.slice(0, 6).map((lang: any) => (
                    <Card key={lang.language} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getLanguageIcon(lang.language)}</span>
                          <span className="font-semibold text-sm">{lang.language}</span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(lang.percentage, 100)}%`,
                              backgroundColor: lang.color,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{getSkillLevel(lang.percentage)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span> Projects
            </h3>
            {profile.githubStats?.topRepositories && profile.githubStats.topRepositories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {profile.githubStats.topRepositories.map((repo: any, index: number) => (
                  <Card key={repo.id} className="border-2 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-6xl">{getProjectIcon(index)}</span>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-sm mb-1 flex items-center gap-1">
                        <span className="text-orange-400">✨</span>
                        {repo.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {repo.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {repo.language && (
                          <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                            📦 {repo.language}
                          </span>
                        )}
                        <span className="px-2 py-1 text-xs rounded bg-yellow-50 text-yellow-700 flex items-center gap-1">
                          ⭐ {repo.stargazers_count}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No projects available</p>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && profile.githubStats && (
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> GitHub Statistics
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="border-2">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{profile.githubStats.publicRepos}</div>
                  <p className="text-xs text-gray-600 mt-1">Repositories</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{profile.githubStats.totalCommits}</div>
                  <p className="text-xs text-gray-600 mt-1">Commits</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{profile.githubStats.totalPRs}</div>
                  <p className="text-xs text-gray-600 mt-1">Pull Requests</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">{profile.githubStats.totalStars}</div>
                  <p className="text-xs text-gray-600 mt-1">Stars</p>
                </CardContent>
              </Card>
            </div>

            {/* Tools Section */}
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="text-xl">🛠️</span> Tools & Technologies
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {profile.githubStats.languages.slice(0, 6).map((lang: any) => (
                <Card key={lang.language} className="border-2">
                  <CardContent className="p-3 flex items-center gap-2">
                    <span className="text-xl">{getLanguageIcon(lang.language)}</span>
                    <span className="text-sm font-medium">{lang.language}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📧</span> Get in Touch
            </h3>
            <div className="space-y-4">
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-gray-600">Contact via GitHub</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {profile.location && (
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-sm text-gray-600">{profile.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {profile.walletAddress && (
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-2xl">🔗</span>
                      </div>
                      <div>
                        <p className="font-semibold">Wallet Address</p>
                        <p className="text-sm text-gray-600 font-mono">
                          {profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8 flex justify-center gap-4">
              {profile.githubUsername && (
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Github className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getLanguageIcon(language: string): string {
  const icons: { [key: string]: string } = {
    JavaScript: '🟨',
    TypeScript: '🔷',
    Python: '🐍',
    Java: '☕',
    Go: '🐹',
    Rust: '🦀',
    Ruby: '💎',
    PHP: '🐘',
    'C++': '⚡',
    'C#': '#️⃣',
    Swift: '🦅',
    Kotlin: '🅺',
    HTML: '🌐',
    CSS: '🎨',
  };
  return icons[language] || '📦';
}

function getProjectIcon(index: number): string {
  const icons = ['🎨', '📱', '💻', '🚀', '⚡', '🔧'];
  return icons[index % icons.length];
}

function getSkillLevel(percentage: number): string {
  if (percentage > 30) return 'Excellent';
  if (percentage > 15) return 'Intermediate';
  return 'Beginner';
}

