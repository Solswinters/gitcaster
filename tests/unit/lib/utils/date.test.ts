import { formatRelativeTime, formatShortDate } from '@/lib/utils/date'

describe('Date Utilities', () => {
  describe('formatRelativeTime', () => {
    it('should format seconds ago', () => {
      const date = new Date(Date.now() - 30 * 1000)
      expect(formatRelativeTime(date)).toBe('just now')
    })

    it('should format minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('5 minutes ago')
    })

    it('should format single minute ago', () => {
      const date = new Date(Date.now() - 1 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('1 minute ago')
    })

    it('should format hours ago', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('3 hours ago')
    })

    it('should format days ago', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('2 days ago')
    })

    it('should format weeks ago', () => {
      const date = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('2 weeks ago')
    })

    it('should format months ago', () => {
      const date = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('3 months ago')
    })

    it('should format years ago', () => {
      const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
      expect(formatRelativeTime(date)).toBe('2 years ago')
    })

    it('should handle string dates', () => {
      const date = new Date(Date.now() - 60 * 1000).toISOString()
      expect(formatRelativeTime(date)).toBe('1 minute ago')
    })
  })

  describe('formatShortDate', () => {
    it('should format date to short string', () => {
      const date = new Date('2024-01-15')
      const formatted = formatShortDate(date)
      expect(formatted).toMatch(/Jan 15, 2024/)
    })

    it('should handle string dates', () => {
      const formatted = formatShortDate('2024-12-25')
      expect(formatted).toMatch(/Dec 25, 2024/)
    })

    it('should handle Date objects', () => {
      const date = new Date(2024, 5, 10) // June 10, 2024
      const formatted = formatShortDate(date)
      expect(formatted).toContain('Jun')
      expect(formatted).toContain('10')
    })
  })
})

