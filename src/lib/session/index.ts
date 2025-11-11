import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { type SessionData, sessionOptions, defaultSession } from './config';

export type { SessionData };

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  
  return session;
}

