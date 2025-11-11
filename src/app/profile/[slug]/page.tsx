import { notFound } from 'next/navigation';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { GitHubStats } from '@/components/profile/GitHubStats';
import { TalentScore } from '@/components/profile/TalentScore';
import { RepositoryCard } from '@/components/profile/RepositoryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';

async function getProfile(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/profile/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const profile = await getProfile(params.slug);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <ProfileHeader profile={profile} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Talent Protocol Score */}
          <div className="lg:col-span-1">
            <TalentScore 
              score={profile.talentScore} 
              passportData={profile.talentPassportData}
            />
          </div>

          {/* GitHub Stats */}
          <div className="lg:col-span-2">
            {profile.githubStats && (
              <GitHubStats stats={profile.githubStats} />
            )}
          </div>
        </div>

        {/* Top Repositories */}
        {profile.githubStats?.topRepositories && profile.githubStats.topRepositories.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Top Repositories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.githubStats.topRepositories.map((repo: any) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}

        {/* Language Distribution */}
        {profile.githubStats?.languages && profile.githubStats.languages.length > 0 && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Programming Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.githubStats.languages.slice(0, 8).map((lang: any) => (
                    <div key={lang.language}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{lang.language}</span>
                        <span className="text-gray-500">{lang.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

