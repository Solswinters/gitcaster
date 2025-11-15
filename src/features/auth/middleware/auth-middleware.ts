/**
 * Auth middleware for protecting routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '../services/session-manager';

export async function authMiddleware(req: NextRequest) {
  const sessionId = req.cookies.get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const session = SessionManager.getSession(sessionId);

  if (!session) {
    return NextResponse.json(
      { error: 'Invalid or expired session' },
      { status: 401 }
    );
  }

  // Add user info to request
  (req as any).user = { userId: session.userId };
  
  return null; // Continue processing
}

export function requireAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authResult = await authMiddleware(req);
    if (authResult) return authResult;
    
    return handler(req);
  };
}

