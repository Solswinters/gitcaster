import { cookieStorage, createStorage, http } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains';
import { createConfig } from 'wagmi';

// Define chains
export const chains = [mainnet, polygon, arbitrum, optimism, base] as const;

// Create wagmi config
export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

