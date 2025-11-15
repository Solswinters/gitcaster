/**
 * Session management service
 */

import type { Session } from '../types';

export class SessionManager {
  private static sessions = new Map<string, Session>();

  /**
   * Create new session
   */
  static createSession(userId: string, token: string, expiresIn: number): Session {
    const session: Session = {
      id: crypto.randomUUID(),
      userId,
      token,
      expiresAt: new Date(Date.now() + expiresIn),
      createdAt: new Date(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get session by ID
   */
  static getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    
    if (!session) return null;
    if (this.isExpired(session)) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Delete session
   */
  static deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Check if session is expired
   */
  static isExpired(session: Session): boolean {
    return session.expiresAt.getTime() < Date.now();
  }

  /**
   * Clean up expired sessions
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (session.expiresAt.getTime() < now) {
        this.sessions.delete(id);
      }
    }
  }
}

