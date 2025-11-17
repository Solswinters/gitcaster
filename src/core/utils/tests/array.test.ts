/**
 * Tests for array utilities
 */

import { unique, groupBy, chunk, sortBy } from '../array/manipulation';
import { findIndex, binarySearch } from '../array/search';

describe('Array Utilities', () => {
  describe('unique', () => {
    it('removes duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('handles empty array', () => {
      expect(unique([])).toEqual([]);
    });

    it('preserves order', () => {
      expect(unique([3, 1, 2, 1])).toEqual([3, 1, 2]);
    });
  });

  describe('groupBy', () => {
    it('groups by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const result = groupBy(items, 'type');
      expect(result.a).toHaveLength(2);
      expect(result.b).toHaveLength(1);
    });

    it('handles empty array', () => {
      expect(groupBy([], 'key')).toEqual({});
    });
  });

  describe('chunk', () => {
    it('splits array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('handles even division', () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('handles size larger than array', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('sortBy', () => {
    it('sorts by key', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const result = sortBy(items, 'value');
      expect(result.map((i) => i.value)).toEqual([1, 2, 3]);
    });

    it('sorts descending', () => {
      const items = [{ value: 1 }, { value: 3 }, { value: 2 }];
      const result = sortBy(items, 'value', 'desc');
      expect(result.map((i) => i.value)).toEqual([3, 2, 1]);
    });
  });

  describe('findIndex', () => {
    it('finds index by predicate', () => {
      const result = findIndex([1, 2, 3, 4], (x) => x > 2);
      expect(result).toBe(2);
    });

    it('returns -1 if not found', () => {
      const result = findIndex([1, 2, 3], (x) => x > 10);
      expect(result).toBe(-1);
    });
  });

  describe('binarySearch', () => {
    it('finds element in sorted array', () => {
      const result = binarySearch([1, 2, 3, 4, 5], 3);
      expect(result).toBe(2);
    });

    it('returns -1 if not found', () => {
      const result = binarySearch([1, 2, 3, 4, 5], 6);
      expect(result).toBe(-1);
    });

    it('handles empty array', () => {
      const result = binarySearch([], 1);
      expect(result).toBe(-1);
    });
  });
});


