'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Github, Wallet } from 'lucide-react';
import { SiweMessage } from 'siwe';
import { useSignMessage } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

export default function OnboardingPage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectors, connect } = useConnect();
  const { open } = useAppKit();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasWalletExtension, setHasWalletExtension] = useState(false);

  // Check for wallet extensions on mount
  useEffect(() => {
    const checkWalletExtension = () => {
      const hasMetaMask = typeof window !== 'undefined' && window.ethereum;
      const hasConnectors = connectors && connectors.length > 0;
      setHasWalletExtension(hasMetaMask || hasConnectors);
    };
    
    checkWalletExtension();
  }, [connectors]);

  // Check existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Handle wallet connection
  useEffect(() => {
    if (isConnected && address && currentStep === 1 && !isAuthenticating) {
      authenticateWithSIWE();
    }
  }, [isConnected, address, currentStep]);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      
      if (session.isLoggedIn) {
        if (session.githubConnected) {
          setCurrentStep(3);
        } else {
          setCurrentStep(2);
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const authenticateWithSIWE = async () => {
    if (isAuthenticating || !address) return;
    
    setIsAuthenticating(true);
    try {
      // First, try to detect if this is a smart wallet (email/social login)
      // Smart wallets from Reown don't need SIWE signing
      const isSmartWallet = await checkIfSmartWallet(address);
      
      if (isSmartWallet) {
        // For smart wallets, just verify with address only
        const verifyRes = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });

        if (verifyRes.ok) {
          const data = await verifyRes.json();
          if (data.user.githubConnected) {
            setCurrentStep(3);
          } else {
            setCurrentStep(2);
          }
          return;
        }
      }

      // For regular EOA wallets (MetaMask, etc.), use SIWE
      try {
        const nonceRes = await fetch('/api/auth/nonce');
        const { nonce } = await nonceRes.json();

        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in to GitCaster',
          uri: window.location.origin,
          version: '1',
          chainId: 1,
          nonce,
        });

        const messageToSign = message.prepareMessage();
        const signature = await signMessageAsync({ message: messageToSign });

        const verifyRes = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageToSign,
            signature,
          }),
        });

        if (verifyRes.ok) {
          const data = await verifyRes.json();
          if (data.user.githubConnected) {
            setCurrentStep(3);
          } else {
            setCurrentStep(2);
          }
        }
      } catch (signError: any) {
        // If signing fails, it might be a smart wallet, try address-only auth
        console.log('Signing failed, trying smart wallet auth:', signError);
        const verifyRes = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });

        if (verifyRes.ok) {
          const data = await verifyRes.json();
          if (data.user.githubConnected) {
            setCurrentStep(3);
          } else {
            setCurrentStep(2);
          }
        } else {
          throw signError;
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (error.message !== 'User rejected the request.') {
        alert('Failed to authenticate. Please try again.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const checkIfSmartWallet = async (address: string): Promise<boolean> => {
    try {
      // Check if address has code (is a contract)
      const response = await fetch(`https://eth.llamarpc.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getCode',
          params: [address, 'latest'],
          id: 1,
        }),
      });
      const data = await response.json();
      // If result is not '0x', it's a smart contract wallet
      return data.result && data.result !== '0x';
    } catch (error) {
      console.error('Error checking if smart wallet:', error);
      return false;
    }
  };

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

      // Sync Talent Protocol data (optional)
      const talentRes = await fetch('/api/sync/talent', {
        method: 'POST',
      });
      
      const talentData = await talentRes.json();
      if (talentData.success && !talentData.hasPassport) {
        console.log('Note: No Talent Protocol passport found - this is optional');
      }

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
                {isCheckingSession ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Checking authentication...</p>
                  </>
                ) : isAuthenticating ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600 mb-2">Authenticating...</p>
                    <p className="text-sm text-gray-500">Please sign the message in your wallet</p>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <Wallet className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-600 mb-2">
                        Connect your wallet to authenticate and create your profile
                      </p>
                      {hasWalletExtension && (
                        <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                          <Check size={16} /> Wallet extension detected
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Button onClick={() => open()} size="lg" className="w-full max-w-sm">
                        <Wallet className="mr-2" size={20} />
                        Connect Wallet
                      </Button>
                      
                      <p className="text-xs text-gray-500">
                        {hasWalletExtension 
                          ? 'Use your browser wallet, email, or social login'
                          : 'Connect via email, social login, or install a wallet extension'
                        }
                      </p>
                    </div>
                  </>
                )}
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

