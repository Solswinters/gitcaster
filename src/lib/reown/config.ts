import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, polygon, arbitrum, optimism, base } from '@reown/appkit/networks';
import { wagmiConfig, projectId } from './wagmi';

// Define metadata
const metadata = {
  name: 'GitCaster',
  description: 'Build your developer reputation profile with GitHub and onchain activity',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [mainnet, polygon, arbitrum, optimism, base],
  projectId,
});

// Create AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, polygon, arbitrum, optimism, base],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'apple'],
    emailShowWallets: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#3b82f6',
  },
});

