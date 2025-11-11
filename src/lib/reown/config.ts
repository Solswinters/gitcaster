import { mainnet, polygon, arbitrum, optimism, base, sepolia } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set');
}

// Define metadata for AppKit
export const metadata = {
  name: 'GitCaster',
  description: 'Build your developer reputation profile with GitHub and onchain activity',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Define supported networks
export const networks = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  sepolia, // Add testnet for development
];

