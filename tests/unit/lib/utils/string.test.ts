import { truncateString, capitalizeFirst, toTitleCase } from '@/lib/utils/string'

describe('String Utilities', () => {
  describe('truncateString', () => {
    it('should truncate long strings', () => {
      const long = 'This is a very long string that needs truncation'
      expect(truncateString(long, 20)).toBe('This is a very long ...')
    })

    it('should not truncate short strings', () => {
      const short = 'Short'
      expect(truncateString(short, 20)).toBe('Short')
    })

    it('should handle exact length', () => {
      const exact = '12345'
      expect(truncateString(exact, 5)).toBe('12345')
    })

    it('should handle empty string', () => {
      expect(truncateString('', 10)).toBe('')
    })

    it('should handle zero maxLength', () => {
      expect(truncateString('test', 0)).toBe('...')
    })
  })

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
    })

    it('should not affect already capitalized', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello')
    })

    it('should handle single character', () => {
      expect(capitalizeFirst('a')).toBe('A')
    })

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('')
    })

    it('should preserve rest of string', () => {
      expect(capitalizeFirst('hello WORLD')).toBe('Hello WORLD')
    })
  })

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World')
    })

    it('should handle already title cased', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World')
    })

    it('should handle all caps', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World')
    })

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello')
    })

    it('should handle multiple spaces', () => {
      expect(toTitleCase('hello  world')).toBe('Hello  World')
    })
  })
})

