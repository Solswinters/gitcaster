import {
  safeJsonParse,
  prettyJson,
  safeJsonStringify,
  jsonClone,
  isValidJson,
  cleanJson,
  flattenJson,
  unflattenJson,
  jsonEquals,
  getJsonPath,
  setJsonPath,
} from '@/shared/utils/json/jsonUtils';

describe('JSON Utils', () => {
  describe('safeJsonParse', () => {
    it('parses valid JSON', () => {
      const result = safeJsonParse('{"key": "value"}', {});
      expect(result).toEqual({ key: 'value' });
    });

    it('returns fallback for invalid JSON', () => {
      const fallback = { default: true };
      const result = safeJsonParse('invalid', fallback);
      expect(result).toEqual(fallback);
    });
  });

  describe('prettyJson', () => {
    it('formats JSON with indentation', () => {
      const obj = { key: 'value', nested: { item: 123 } };
      const result = prettyJson(obj);
      expect(result).toContain('\n');
      expect(result).toContain('  ');
    });

    it('supports custom spacing', () => {
      const obj = { key: 'value' };
      const result = prettyJson(obj, 4);
      expect(result).toContain('    ');
    });
  });

  describe('safeJsonStringify', () => {
    it('stringifies valid object', () => {
      const obj = { key: 'value' };
      const result = safeJsonStringify(obj);
      expect(result).toBe('{"key":"value"}');
    });

    it('returns fallback for circular references', () => {
      const obj: any = {};
      obj.self = obj;
      const result = safeJsonStringify(obj, '{}');
      expect(result).toBe('{}');
    });
  });

  describe('jsonClone', () => {
    it('creates deep clone of object', () => {
      const original = { a: 1, b: { c: 2 } };
      const clone = jsonClone(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
      expect(clone.b).not.toBe(original.b);
    });

    it('clones arrays', () => {
      const original = [1, 2, { a: 3 }];
      const clone = jsonClone(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
    });
  });

  describe('isValidJson', () => {
    it('validates correct JSON', () => {
      expect(isValidJson('{"key": "value"}')).toBe(true);
      expect(isValidJson('[1, 2, 3]')).toBe(true);
      expect(isValidJson('"string"')).toBe(true);
    });

    it('rejects invalid JSON', () => {
      expect(isValidJson('{')).toBe(false);
      expect(isValidJson('undefined')).toBe(false);
      expect(isValidJson('')).toBe(false);
    });
  });

  describe('cleanJson', () => {
    it('removes null and undefined values', () => {
      const obj = { a: 1, b: null, c: undefined, d: { e: null } };
      const result = cleanJson(obj);

      expect(result).toEqual({ a: 1, d: {} });
    });
  });

  describe('flattenJson', () => {
    it('flattens nested object', () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
      const result = flattenJson(obj);

      expect(result).toEqual({
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      });
    });

    it('handles arrays', () => {
      const obj = { a: [1, 2, 3] };
      const result = flattenJson(obj);

      expect(result).toEqual({ a: [1, 2, 3] });
    });
  });

  describe('unflattenJson', () => {
    it('unflattens object', () => {
      const flat = { a: 1, 'b.c': 2, 'b.d.e': 3 };
      const result = unflattenJson(flat);

      expect(result).toEqual({
        a: 1,
        b: { c: 2, d: { e: 3 } },
      });
    });
  });

  describe('jsonEquals', () => {
    it('compares objects correctly', () => {
      const a = { key: 'value', num: 123 };
      const b = { key: 'value', num: 123 };
      const c = { key: 'different' };

      expect(jsonEquals(a, b)).toBe(true);
      expect(jsonEquals(a, c)).toBe(false);
    });

    it('handles arrays', () => {
      expect(jsonEquals([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(jsonEquals([1, 2, 3], [1, 2, 4])).toBe(false);
    });
  });

  describe('getJsonPath', () => {
    it('gets value from nested path', () => {
      const obj = { a: { b: { c: 'value' } } };

      expect(getJsonPath(obj, 'a.b.c')).toBe('value');
      expect(getJsonPath(obj, 'a.b')).toEqual({ c: 'value' });
    });

    it('returns undefined for non-existent path', () => {
      const obj = { a: { b: 'value' } };
      expect(getJsonPath(obj, 'a.c.d')).toBeUndefined();
    });
  });

  describe('setJsonPath', () => {
    it('sets value at nested path', () => {
      const obj: any = {};
      setJsonPath(obj, 'a.b.c', 'value');

      expect(obj).toEqual({ a: { b: { c: 'value' } } });
    });

    it('overwrites existing value', () => {
      const obj: any = { a: { b: 'old' } };
      setJsonPath(obj, 'a.b', 'new');

      expect(obj.a.b).toBe('new');
    });
  });
});

