/**
 * Format utilities tests
 */

import { describe, it, expect } from '@jest/globals';
import { formatNumber, formatDate, truncateString, capitalizeFirstLetter } from '../format';

describe('Format utilities', () => {
  it('should format numbers', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('should format dates', () => {
    const date = new Date('2024-01-01');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024');
  });

  it('should truncate strings', () => {
    const long = 'This is a very long string that should be truncated';
    const truncated = truncateString(long, 20);
    expect(truncated.length).toBeLessThanOrEqual(23); // 20 + '...'
  });

  it('should capitalize first letter', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('world')).toBe('World');
  });
});

