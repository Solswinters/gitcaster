import { SessionOptions } from 'iron-session';

export interface SessionData {
  walletAddress?: string;
  siwe?: {
    address: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
  };
  userId?: string;
  githubConnected?: boolean;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'gitcaster-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

