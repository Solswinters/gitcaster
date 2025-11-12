import { SessionData, sessionOptions, defaultSession } from '@/lib/session/config'

describe('Session Configuration', () => {
  describe('sessionOptions', () => {
    it('should have correct cookie name', () => {
      expect(sessionOptions.cookieName).toBe('gitcaster-session')
    })

    it('should use SESSION_SECRET from environment', () => {
      expect(sessionOptions.password).toBeDefined()
      expect(sessionOptions.password).toBe(process.env.SESSION_SECRET)
    })

    it('should have httpOnly cookies', () => {
      expect(sessionOptions.cookieOptions.httpOnly).toBe(true)
    })

    it('should have sameSite lax', () => {
      expect(sessionOptions.cookieOptions.sameSite).toBe('lax')
    })

    it('should have 7 day maxAge', () => {
      const sevenDaysInSeconds = 60 * 60 * 24 * 7
      expect(sessionOptions.cookieOptions.maxAge).toBe(sevenDaysInSeconds)
    })

    it('should set secure based on NODE_ENV', () => {
      const isProduction = process.env.NODE_ENV === 'production'
      expect(sessionOptions.cookieOptions.secure).toBe(isProduction)
    })
  })

  describe('defaultSession', () => {
    it('should have isLoggedIn false by default', () => {
      expect(defaultSession.isLoggedIn).toBe(false)
    })

    it('should not have walletAddress by default', () => {
      expect(defaultSession.walletAddress).toBeUndefined()
    })

    it('should not have userId by default', () => {
      expect(defaultSession.userId).toBeUndefined()
    })

    it('should not have githubConnected by default', () => {
      expect(defaultSession.githubConnected).toBeUndefined()
    })
  })

  describe('SessionData interface', () => {
    it('should allow creating a logged-in session', () => {
      const session: SessionData = {
        isLoggedIn: true,
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        userId: 'user-123',
        githubConnected: true,
      }

      expect(session.isLoggedIn).toBe(true)
      expect(session.walletAddress).toBeDefined()
      expect(session.userId).toBeDefined()
      expect(session.githubConnected).toBe(true)
    })

    it('should allow SIWE session data', () => {
      const session: SessionData = {
        isLoggedIn: true,
        siwe: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          chainId: 1,
          nonce: 'random-nonce',
          issuedAt: new Date().toISOString(),
        },
      }

      expect(session.siwe).toBeDefined()
      expect(session.siwe?.chainId).toBe(1)
      expect(session.siwe?.nonce).toBeTruthy()
    })
  })
})

