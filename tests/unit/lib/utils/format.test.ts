import { formatBytes, formatDuration, pluralize } from '@/lib/utils/format'

describe('Format Utilities', () => {
  describe('formatBytes', () => {
    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
    })

    it('should format bytes', () => {
      expect(formatBytes(500)).toBe('500 Bytes')
    })

    it('should format kilobytes', () => {
      expect(formatBytes(1024)).toBe('1 KB')
    })

    it('should format megabytes', () => {
      expect(formatBytes(1024 * 1024)).toBe('1 MB')
    })

    it('should format gigabytes', () => {
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should handle decimal precision', () => {
      const result = formatBytes(1536, 1)
      expect(result).toBe('1.5 KB')
    })

    it('should handle large numbers', () => {
      const result = formatBytes(1024 * 1024 * 1024 * 1024)
      expect(result).toBe('1 TB')
    })
  })

  describe('formatDuration', () => {
    it('should format seconds only', () => {
      expect(formatDuration(45)).toBe('45s')
    })

    it('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2m 5s')
    })

    it('should format hours, minutes, and seconds', () => {
      expect(formatDuration(3665)).toBe('1h 1m 5s')
    })

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0s')
    })

    it('should format hours only', () => {
      expect(formatDuration(3600)).toBe('1h')
    })

    it('should format minutes only', () => {
      expect(formatDuration(60)).toBe('1m')
    })

    it('should omit zero components', () => {
      expect(formatDuration(3601)).toBe('1h 1s')
    })
  })

  describe('pluralize', () => {
    it('should return singular for 1', () => {
      expect(pluralize(1, 'item')).toBe('item')
    })

    it('should return plural for 0', () => {
      expect(pluralize(0, 'item')).toBe('items')
    })

    it('should return plural for multiple', () => {
      expect(pluralize(5, 'item')).toBe('items')
    })

    it('should use custom plural', () => {
      expect(pluralize(2, 'child', 'children')).toBe('children')
    })

    it('should handle irregular plurals', () => {
      expect(pluralize(1, 'person', 'people')).toBe('person')
      expect(pluralize(2, 'person', 'people')).toBe('people')
    })

    it('should auto-pluralize with s', () => {
      expect(pluralize(3, 'cat')).toBe('cats')
    })
  })
})

