'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { projectId, metadata, networks } from './config';

// Create a client
const queryClient = new QueryClient();

// Create the Wagmi Adapter with proper configuration
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks,
  projectId: projectId!,
});

// Create AppKit instance with all features enabled
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: projectId!,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'apple', 'facebook', 'x', 'discord'],
    emailShowWallets: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#3b82f6',
  },
  allWallets: 'SHOW', // Show all available wallets
  enableWalletGuide: true,
});

export function ReownProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

