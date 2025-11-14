/**
 * Global Type Definitions
 *
 * Global type declarations and augmentations
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      NEXT_PUBLIC_PROJECT_ID: string;
      TALENT_PROTOCOL_API_KEY?: string;
    }
  }

  interface Window {
    ethereum?: any;
  }
}

export {};

