import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

import { type SessionData, sessionOptions, defaultSession } from './config';

export type { SessionData };

/**
 * Get the current user session from encrypted cookies
 * @returns Promise resolving to SessionData with user information
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  
  return session;
}

