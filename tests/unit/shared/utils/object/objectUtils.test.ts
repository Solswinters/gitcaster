import { deepMerge, pick, omit, isEmpty } from '@/shared/utils/object/objectUtils';

describe('objectUtils', () => {
  describe('deepMerge', () => {
    it('merges simple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };

      expect(deepMerge(obj1, obj2)).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('merges nested objects', () => {
      const obj1 = { a: { b: 1, c: 2 } };
      const obj2 = { a: { c: 3, d: 4 } };

      expect(deepMerge(obj1, obj2)).toEqual({
        a: { b: 1, c: 3, d: 4 },
      });
    });

    it('handles arrays', () => {
      const obj1 = { arr: [1, 2] };
      const obj2 = { arr: [3, 4] };

      expect(deepMerge(obj1, obj2)).toEqual({ arr: [3, 4] });
    });
  });

  describe('pick', () => {
    it('picks specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };

      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('ignores non-existent keys', () => {
      const obj = { a: 1, b: 2 };

      expect(pick(obj, ['a', 'z' as any])).toEqual({ a: 1 });
    });
  });

  describe('omit', () => {
    it('omits specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };

      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('returns same object if no keys to omit', () => {
      const obj = { a: 1, b: 2 };

      expect(omit(obj, ['z' as any])).toEqual({ a: 1, b: 2 });
    });
  });

  describe('isEmpty', () => {
    it('returns true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('returns false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });
});

