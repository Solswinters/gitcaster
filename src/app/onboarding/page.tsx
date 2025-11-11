'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Github } from 'lucide-react';

export default function OnboardingPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    if (isConnected && address) {
      setCurrentStep(2);
    }
  }, [isConnected, address]);

  const connectGitHub = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23liVQtsdvlqV0Ipt7';
    const redirectUri = `${window.location.origin}/api/github/callback`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user,repo`;
    
    window.location.href = githubAuthUrl;
  };

  const syncData = async () => {
    if (!githubToken) {
      alert('Please provide a GitHub token for syncing');
      return;
    }

    setIsSyncing(true);
    try {
      // Sync GitHub data
      const githubRes = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubToken }),
      });

      if (!githubRes.ok) {
        throw new Error('Failed to sync GitHub data');
      }

      // Sync Talent Protocol data
      await fetch('/api/sync/talent', {
        method: 'POST',
      });

      setCurrentStep(4);
      
      // Get session to find profile slug
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-gray-600">Follow these steps to set up your developer profile</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[
            { num: 1, label: 'Connect Wallet' },
            { num: 2, label: 'Connect GitHub' },
            { num: 3, label: 'Sync Data' },
            { num: 4, label: 'Complete' },
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.num ? <Check size={20} /> : step.num}
              </div>
              <span className="text-xs mt-2 text-gray-600">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Step 1: Connect Your Wallet'}
              {currentStep === 2 && 'Step 2: Connect Your GitHub'}
              {currentStep === 3 && 'Step 3: Sync Your Data'}
              {currentStep === 4 && 'Profile Created!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <div className="text-center py-8">
                <p className="mb-6 text-gray-600">
                  Connect your wallet to authenticate and create your profile
                </p>
                <p className="text-sm text-gray-500">
                  Click "Connect Wallet" in the header to get started
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center py-8">
                <p className="mb-6 text-gray-600">
                  Connect your GitHub account to fetch your development activity
                </p>
                <Button onClick={connectGitHub} size="lg">
                  <Github className="mr-2" />
                  Connect GitHub
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="py-8 space-y-4">
                <p className="text-center text-gray-600 mb-6">
                  We'll sync your GitHub activity and Talent Protocol score
                </p>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    GitHub Personal Access Token (for demo)
                  </label>
                  <input
                    type="text"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500">
                    Create a token at: Settings → Developer settings → Personal access tokens
                  </p>
                </div>
                <Button
                  onClick={syncData}
                  disabled={isSyncing || !githubToken}
                  size="lg"
                  className="w-full"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" />
                      Syncing Data...
                    </>
                  ) : (
                    'Sync My Data'
                  )}
                </Button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center py-8">
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Profile Created!</h3>
                <p className="text-gray-600 mb-6">
                  Your developer profile is ready. Redirecting to dashboard...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

