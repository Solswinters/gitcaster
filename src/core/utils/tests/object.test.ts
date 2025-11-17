/**
 * Tests for object utilities
 */

import { pick, omit, merge, deepClone } from '../object/manipulation';
import { flattenObject, unflattenObject } from '../object/transform';

describe('Object Utilities', () => {
  describe('pick', () => {
    it('picks specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('handles non-existent keys', () => {
      const obj = { a: 1 };
      expect(pick(obj, ['a', 'b'])).toEqual({ a: 1 });
    });

    it('handles empty array', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, [])).toEqual({});
    });
  });

  describe('omit', () => {
    it('omits specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('handles non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ['c'])).toEqual({ a: 1, b: 2 });
    });

    it('handles empty array', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, [])).toEqual({ a: 1, b: 2 });
    });
  });

  describe('merge', () => {
    it('merges objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      expect(merge(obj1, obj2)).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('handles nested objects', () => {
      const obj1 = { a: { x: 1 } };
      const obj2 = { a: { y: 2 } };
      expect(merge(obj1, obj2)).toEqual({ a: { x: 1, y: 2 } });
    });

    it('overwrites arrays', () => {
      const obj1 = { a: [1, 2] };
      const obj2 = { a: [3, 4] };
      expect(merge(obj1, obj2)).toEqual({ a: [3, 4] });
    });
  });

  describe('deepClone', () => {
    it('clones object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('clones array', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('handles null and undefined', () => {
      expect(deepClone(null)).toBeNull();
      expect(deepClone(undefined)).toBeUndefined();
    });
  });

  describe('flattenObject', () => {
    it('flattens nested object', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(flattenObject(obj)).toEqual({ 'a.b.c': 1 });
    });

    it('handles arrays', () => {
      const obj = { a: [1, 2] };
      expect(flattenObject(obj)).toEqual({ 'a.0': 1, 'a.1': 2 });
    });

    it('handles mixed nesting', () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
      expect(flattenObject(obj)).toEqual({ a: 1, 'b.c': 2, 'b.d.e': 3 });
    });
  });

  describe('unflattenObject', () => {
    it('unflattens object', () => {
      const obj = { 'a.b.c': 1 };
      expect(unflattenObject(obj)).toEqual({ a: { b: { c: 1 } } });
    });

    it('handles array indices', () => {
      const obj = { 'a.0': 1, 'a.1': 2 };
      expect(unflattenObject(obj)).toEqual({ a: [1, 2] });
    });

    it('handles mixed keys', () => {
      const obj = { a: 1, 'b.c': 2, 'b.d.e': 3 };
      expect(unflattenObject(obj)).toEqual({ a: 1, b: { c: 2, d: { e: 3 } } });
    });
  });
});

