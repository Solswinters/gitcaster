/**
 * Array Utilities Tests
 */

import {
  unique,
  chunk,
  flatten,
  groupBy,
  sortBy,
  intersection,
  difference,
  sum,
  average,
} from '@/shared/utils/array/arrayUtils';

describe('Array Utilities', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('flatten', () => {
    it('should flatten one level', () => {
      expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
      expect(flatten([['a'], ['b', 'c']])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('groupBy', () => {
    it('should group by key', () => {
      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
        { type: 'vegetable', name: 'carrot' },
      ];

      const grouped = groupBy(items, 'type');

      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
    });
  });

  describe('sortBy', () => {
    it('should sort by key ascending', () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = sortBy(items, 'age', 'asc');
      
      expect(sorted.map(i => i.age)).toEqual([20, 25, 30]);
    });

    it('should sort by key descending', () => {
      const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
      const sorted = sortBy(items, 'age', 'desc');
      
      expect(sorted.map(i => i.age)).toEqual([30, 25, 20]);
    });
  });

  describe('intersection', () => {
    it('should find common elements', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
      expect(intersection(['a', 'b'], ['b', 'c'])).toEqual(['b']);
    });

    it('should handle no intersection', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });
  });

  describe('difference', () => {
    it('should find elements in first array but not second', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
      expect(difference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
    });
  });

  describe('sum', () => {
    it('should calculate sum', () => {
      expect(sum([1, 2, 3, 4])).toBe(10);
      expect(sum([10, 20, 30])).toBe(60);
    });

    it('should handle empty array', () => {
      expect(sum([])).toBe(0);
    });
  });

  describe('average', () => {
    it('should calculate average', () => {
      expect(average([1, 2, 3, 4])).toBe(2.5);
      expect(average([10, 20, 30])).toBe(20);
    });

    it('should handle empty array', () => {
      expect(average([])).toBe(0);
    });
  });
});

