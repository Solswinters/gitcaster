import {

  formatCurrency,
  formatCurrencyCompact,
  parseCurrency,
} from '@/lib/formatters/currency-formatter';

describe('Currency Formatter', () => {
  describe('formatCurrency', () => {
    it('should format USD by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should handle zero and negative amounts', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });

    it('should format different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
    });

    it('should respect decimal places', () => {
      expect(formatCurrency(1234.567, 'USD', { decimals: 2 })).toBe('$1,234.57');
      expect(formatCurrency(1000, 'USD', { decimals: 0 })).toBe('$1,000');
    });
  });

  describe('formatCurrencyCompact', () => {
    it('should format small amounts normally', () => {
      expect(formatCurrencyCompact(100)).toBe('$100');
      expect(formatCurrencyCompact(999)).toBe('$999');
    });

    it('should format thousands with K suffix', () => {
      expect(formatCurrencyCompact(1000)).toBe('$1K');
      expect(formatCurrencyCompact(1500)).toBe('$1.5K');
      expect(formatCurrencyCompact(12345)).toBe('$12.3K');
    });

    it('should format millions with M suffix', () => {
      expect(formatCurrencyCompact(1000000)).toBe('$1M');
      expect(formatCurrencyCompact(1500000)).toBe('$1.5M');
    });

    it('should work with different currencies', () => {
      expect(formatCurrencyCompact(1000000, 'EUR')).toBe('€1M');
      expect(formatCurrencyCompact(5000, 'GBP')).toBe('£5K');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency strings to numbers', () => {
      expect(parseCurrency('$1,000.00')).toBe(1000);
      expect(parseCurrency('€1,234.56')).toBe(1234.56);
      expect(parseCurrency('£100')).toBe(100);
    });

    it('should handle negative amounts', () => {
      expect(parseCurrency('-$100.00')).toBe(-100);
      expect(parseCurrency('($100.00)')).toBe(-100);
    });

    it('should handle compact notation', () => {
      expect(parseCurrency('$1K')).toBe(1000);
      expect(parseCurrency('$1.5M')).toBe(1500000);
      expect(parseCurrency('€2.5K')).toBe(2500);
    });

    it('should return 0 for invalid input', () => {
      expect(parseCurrency('invalid')).toBe(0);
      expect(parseCurrency('')).toBe(0);
    });
  });
});

