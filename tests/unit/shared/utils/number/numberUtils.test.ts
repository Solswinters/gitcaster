import {
  clamp,
  roundTo,
  percentage,
  percentageChange,
  lerp,
  map,
  inRange,
  randomInt,
  randomFloat,
  sum,
  average,
  median,
  min,
  max,
  standardDeviation,
  isEven,
  isOdd,
  isPrime,
  factorial,
  gcd,
  lcm,
  formatBytes,
  parseBytes,
  isNumeric,
  safeDivide,
  ordinal,
} from '@/shared/utils/number/numberUtils';

describe('Number Utils', () => {
  describe('clamp', () => {
    it('clamps value to range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('roundTo', () => {
    it('rounds to decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 0)).toBe(3);
      expect(roundTo(3.14159, 4)).toBe(3.1416);
    });
  });

  describe('percentage', () => {
    it('calculates percentage', () => {
      expect(percentage(25, 100)).toBe(25);
      expect(percentage(1, 4)).toBe(25);
      expect(percentage(3, 4)).toBe(75);
    });

    it('handles zero total', () => {
      expect(percentage(5, 0)).toBe(0);
    });
  });

  describe('percentageChange', () => {
    it('calculates percentage change', () => {
      expect(percentageChange(100, 150)).toBe(50);
      expect(percentageChange(100, 50)).toBe(-50);
    });

    it('handles zero old value', () => {
      expect(percentageChange(0, 100)).toBe(100);
      expect(percentageChange(0, 0)).toBe(0);
    });
  });

  describe('lerp', () => {
    it('interpolates linearly', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });
  });

  describe('map', () => {
    it('maps value from one range to another', () => {
      expect(map(5, 0, 10, 0, 100)).toBe(50);
      expect(map(0, 0, 10, 0, 100)).toBe(0);
      expect(map(10, 0, 10, 0, 100)).toBe(100);
    });
  });

  describe('inRange', () => {
    it('checks if value is in range', () => {
      expect(inRange(5, 0, 10)).toBe(true);
      expect(inRange(0, 0, 10)).toBe(true);
      expect(inRange(10, 0, 10)).toBe(true);
      expect(inRange(-1, 0, 10)).toBe(false);
      expect(inRange(11, 0, 10)).toBe(false);
    });
  });

  describe('randomInt', () => {
    it('generates random integer in range', () => {
      const value = randomInt(1, 10);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    });
  });

  describe('randomFloat', () => {
    it('generates random float in range', () => {
      const value = randomFloat(1, 10);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThan(10);
    });
  });

  describe('sum', () => {
    it('sums array of numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
      expect(sum([])).toBe(0);
    });
  });

  describe('average', () => {
    it('calculates average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([10, 20])).toBe(15);
      expect(average([])).toBe(0);
    });
  });

  describe('median', () => {
    it('calculates median for odd length', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3);
    });

    it('calculates median for even length', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it('handles empty array', () => {
      expect(median([])).toBe(0);
    });
  });

  describe('min', () => {
    it('finds minimum value', () => {
      expect(min([5, 2, 8, 1, 9])).toBe(1);
    });
  });

  describe('max', () => {
    it('finds maximum value', () => {
      expect(max([5, 2, 8, 1, 9])).toBe(9);
    });
  });

  describe('standardDeviation', () => {
    it('calculates standard deviation', () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const sd = standardDeviation(values);
      expect(sd).toBeCloseTo(2, 0);
    });

    it('handles empty array', () => {
      expect(standardDeviation([])).toBe(0);
    });
  });

  describe('isEven', () => {
    it('checks if number is even', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(3)).toBe(false);
      expect(isEven(0)).toBe(true);
    });
  });

  describe('isOdd', () => {
    it('checks if number is odd', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
      expect(isOdd(2)).toBe(false);
      expect(isOdd(0)).toBe(false);
    });
  });

  describe('isPrime', () => {
    it('checks if number is prime', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(5)).toBe(true);
      expect(isPrime(7)).toBe(true);
      expect(isPrime(11)).toBe(true);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(6)).toBe(false);
      expect(isPrime(1)).toBe(false);
      expect(isPrime(0)).toBe(false);
    });
  });

  describe('factorial', () => {
    it('calculates factorial', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(6)).toBe(720);
    });

    it('throws for negative numbers', () => {
      expect(() => factorial(-1)).toThrow();
    });
  });

  describe('gcd', () => {
    it('calculates greatest common divisor', () => {
      expect(gcd(12, 8)).toBe(4);
      expect(gcd(54, 24)).toBe(6);
      expect(gcd(7, 3)).toBe(1);
    });
  });

  describe('lcm', () => {
    it('calculates least common multiple', () => {
      expect(lcm(12, 8)).toBe(24);
      expect(lcm(3, 5)).toBe(15);
    });
  });

  describe('formatBytes', () => {
    it('formats bytes to human-readable', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('respects decimal places', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB');
      expect(formatBytes(1536, 2)).toBe('1.5 KB');
    });
  });

  describe('parseBytes', () => {
    it('parses byte strings', () => {
      expect(parseBytes('1 KB')).toBe(1024);
      expect(parseBytes('1 MB')).toBe(1024 * 1024);
      expect(parseBytes('1.5 GB')).toBe(1.5 * 1024 * 1024 * 1024);
    });

    it('handles invalid input', () => {
      expect(parseBytes('invalid')).toBe(0);
    });
  });

  describe('isNumeric', () => {
    it('checks if value is numeric', () => {
      expect(isNumeric(123)).toBe(true);
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('123.45')).toBe(true);
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric(null)).toBe(false);
      expect(isNumeric(undefined)).toBe(false);
    });
  });

  describe('safeDivide', () => {
    it('divides safely', () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(10, 0)).toBe(0);
    });
  });

  describe('ordinal', () => {
    it('formats numbers with ordinal suffix', () => {
      expect(ordinal(1)).toBe('1st');
      expect(ordinal(2)).toBe('2nd');
      expect(ordinal(3)).toBe('3rd');
      expect(ordinal(4)).toBe('4th');
      expect(ordinal(11)).toBe('11th');
      expect(ordinal(21)).toBe('21st');
      expect(ordinal(22)).toBe('22nd');
      expect(ordinal(23)).toBe('23rd');
    });
  });
});

