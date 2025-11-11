'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, Copy, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    fetchSession();
  }, [isConnected, address, router]);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setSession(data);

      if (!data.isLoggedIn) {
        router.push('/');
        return;
      }

      if (!data.githubConnected) {
        router.push('/onboarding');
        return;
      }

      // Fetch profile data
      await fetchProfileData();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const slug = address?.toLowerCase();
      const res = await fetch(`/api/profile/${slug}`);
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Check if user has a stored token
      if (!session?.hasGithubToken) {
        // Need to provide token for first-time or legacy accounts
        const token = prompt(
          'GitHub token not found. Please provide your GitHub Personal Access Token:\n\n' +
          'Create one at: https://github.com/settings/tokens\n' +
          'Required scopes: repo, read:user, read:org\n\n' +
          'This is a one-time setup - the token will be saved.'
        );
        
        if (!token) {
          setIsRefreshing(false);
          return;
        }
        
        // Sync with provided token (will be saved for future use)
        const syncRes = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubToken: token }),
        });

        if (!syncRes.ok) {
          throw new Error('Failed to sync data');
        }
      } else {
        // Sync GitHub data (using stored token)
        const syncRes = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        if (!syncRes.ok) {
          throw new Error('Failed to sync data');
        }
      }

      // Sync Talent Protocol data
      await fetch('/api/sync/talent', {
        method: 'POST',
      });

      // Refresh profile data
      await fetchProfileData();
      
      alert('Data refreshed successfully! Token saved for future syncs.');
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${address?.toLowerCase()}`;
    navigator.clipboard.writeText(profileUrl);
    alert('Profile link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your developer profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold">Wallet Connected</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <Check className="text-green-600" />
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg ${
                session?.hasGithubToken ? 'bg-green-50' : 'bg-yellow-50'
              }`}>
                <div>
                  <p className="font-semibold">GitHub Connected</p>
                  <p className="text-sm text-gray-600">
                    {session?.hasGithubToken 
                      ? 'Token saved - auto-refresh enabled' 
                      : 'Token not saved - click Refresh to setup'
                    }
                  </p>
                </div>
                {session?.hasGithubToken ? (
                  <Check className="text-green-600" />
                ) : (
                  <svg className="text-yellow-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={refreshData} loading={isRefreshing} variant="outline">
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
                <Button onClick={copyProfileLink} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Profile Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => router.push(`/profile/${address?.toLowerCase()}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View My Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  const githubUrl = profile?.user?.githubUsername 
                    ? `https://github.com/${profile.user.githubUsername}`
                    : 'https://github.com';
                  window.open(githubUrl, '_blank');
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                GitHub Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {profile?.viewCount || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">Profile Views</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {profile?.githubStats?.publicRepos || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">GitHub Repos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {profile?.githubStats?.totalCommits || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Commits</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {profile?.talentScore ? Math.round(profile.talentScore) : '--'}
                </p>
                <p className="text-sm text-gray-600 mt-1">Talent Score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

