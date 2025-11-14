import {
  mean,
  variance,
  standardDeviation,
  percentile,
  correlation,
  linearRegression,
  movingAverage,
  normalize,
  exponentialSmoothing,
} from '@/shared/utils/math/mathUtils';

describe('Math Utils', () => {
  describe('mean', () => {
    it('calculates mean correctly', () => {
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
      expect(mean([10, 20, 30])).toBe(20);
    });

    it('handles empty array', () => {
      expect(mean([])).toBe(0);
    });
  });

  describe('variance', () => {
    it('calculates variance correctly', () => {
      const result = variance([1, 2, 3, 4, 5]);
      expect(result).toBeCloseTo(2, 0);
    });

    it('handles empty array', () => {
      expect(variance([])).toBe(0);
    });
  });

  describe('standardDeviation', () => {
    it('calculates standard deviation correctly', () => {
      const result = standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(result).toBeCloseTo(2, 0);
    });
  });

  describe('percentile', () => {
    it('calculates percentile correctly', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(percentile(data, 50)).toBe(5.5);
      expect(percentile(data, 25)).toBe(3.25);
      expect(percentile(data, 75)).toBe(7.75);
    });

    it('handles empty array', () => {
      expect(percentile([], 50)).toBe(0);
    });
  });

  describe('correlation', () => {
    it('calculates correlation correctly', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];
      expect(correlation(x, y)).toBeCloseTo(1, 5);
    });

    it('handles negative correlation', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [10, 8, 6, 4, 2];
      expect(correlation(x, y)).toBeCloseTo(-1, 5);
    });

    it('handles mismatched arrays', () => {
      expect(correlation([1, 2], [1, 2, 3])).toBe(0);
    });

    it('handles empty arrays', () => {
      expect(correlation([], [])).toBe(0);
    });
  });

  describe('linearRegression', () => {
    it('calculates regression correctly', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 5, 4, 5];
      const result = linearRegression(x, y);

      expect(result.slope).toBeCloseTo(0.6, 1);
      expect(result.r2).toBeGreaterThan(0);
    });

    it('handles perfect linear relationship', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];
      const result = linearRegression(x, y);

      expect(result.slope).toBeCloseTo(2, 5);
      expect(result.intercept).toBeCloseTo(0, 5);
      expect(result.r2).toBeCloseTo(1, 5);
    });

    it('handles empty arrays', () => {
      const result = linearRegression([], []);
      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(0);
      expect(result.r2).toBe(0);
    });
  });

  describe('movingAverage', () => {
    it('calculates moving average correctly', () => {
      const data = [1, 2, 3, 4, 5];
      const result = movingAverage(data, 3);

      expect(result[0]).toBe(1);
      expect(result[1]).toBe(1.5);
      expect(result[2]).toBe(2);
      expect(result[3]).toBe(3);
      expect(result[4]).toBe(4);
    });

    it('handles window size 1', () => {
      const data = [1, 2, 3];
      const result = movingAverage(data, 1);

      expect(result).toEqual(data);
    });
  });

  describe('normalize', () => {
    it('normalizes values to 0-1 range', () => {
      const data = [0, 5, 10];
      const result = normalize(data);

      expect(result[0]).toBe(0);
      expect(result[1]).toBe(0.5);
      expect(result[2]).toBe(1);
    });

    it('handles all same values', () => {
      const data = [5, 5, 5];
      const result = normalize(data);

      expect(result).toEqual([0, 0, 0]);
    });
  });

  describe('exponentialSmoothing', () => {
    it('smooths data correctly', () => {
      const data = [10, 15, 13, 17, 20];
      const result = exponentialSmoothing(data, 0.3);

      expect(result[0]).toBe(10);
      expect(result.length).toBe(data.length);
      expect(result[4]).toBeCloseTo(15.63, 1);
    });

    it('handles empty array', () => {
      expect(exponentialSmoothing([])).toEqual([]);
    });
  });
});

