import {
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatOrdinal,
} from '@/lib/formatters/number-formatter';

describe('Number Formatter', () => {
  describe('formatNumber', () => {
    it('should format numbers with default locale', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });

    it('should handle zero and negative numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-1000)).toBe('-1,000');
    });

    it('should respect decimal places', () => {
      expect(formatNumber(1234.5678, { decimals: 2 })).toBe('1,234.57');
      expect(formatNumber(1000, { decimals: 2 })).toBe('1,000.00');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format small numbers normally', () => {
      expect(formatCompactNumber(100)).toBe('100');
      expect(formatCompactNumber(999)).toBe('999');
    });

    it('should format thousands with K suffix', () => {
      expect(formatCompactNumber(1000)).toBe('1K');
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(12345)).toBe('12.3K');
    });

    it('should format millions with M suffix', () => {
      expect(formatCompactNumber(1000000)).toBe('1M');
      expect(formatCompactNumber(1500000)).toBe('1.5M');
      expect(formatCompactNumber(12345678)).toBe('12.3M');
    });

    it('should format billions with B suffix', () => {
      expect(formatCompactNumber(1000000000)).toBe('1B');
      expect(formatCompactNumber(1500000000)).toBe('1.5B');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.5)).toBe('50%');
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(1)).toBe('100%');
    });

    it('should handle zero and negative percentages', () => {
      expect(formatPercentage(0)).toBe('0%');
      expect(formatPercentage(-0.1)).toBe('-10%');
    });

    it('should respect decimal places', () => {
      expect(formatPercentage(0.12345, 1)).toBe('12.3%');
      expect(formatPercentage(0.12345, 3)).toBe('12.345%');
    });
  });

  describe('formatOrdinal', () => {
    it('should format ordinal numbers correctly', () => {
      expect(formatOrdinal(1)).toBe('1st');
      expect(formatOrdinal(2)).toBe('2nd');
      expect(formatOrdinal(3)).toBe('3rd');
      expect(formatOrdinal(4)).toBe('4th');
    });

    it('should handle teens correctly', () => {
      expect(formatOrdinal(11)).toBe('11th');
      expect(formatOrdinal(12)).toBe('12th');
      expect(formatOrdinal(13)).toBe('13th');
    });

    it('should handle larger numbers', () => {
      expect(formatOrdinal(21)).toBe('21st');
      expect(formatOrdinal(22)).toBe('22nd');
      expect(formatOrdinal(23)).toBe('23rd');
      expect(formatOrdinal(101)).toBe('101st');
    });
  });
});

