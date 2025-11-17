/**
 * Tests for string utilities
 */

import { capitalize, toCamelCase, toKebabCase, toSnakeCase } from '../string/case-conversion';
import { truncate } from '../string/truncate';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('preserves rest of string', () => {
      expect(capitalize('hELLO')).toBe('HELLO');
    });
  });

  describe('toCamelCase', () => {
    it('converts to camel case', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    it('handles multiple separators', () => {
      expect(toCamelCase('hello_world_test')).toBe('helloWorldTest');
    });

    it('handles mixed case', () => {
      expect(toCamelCase('Hello-World')).toBe('helloWorld');
    });
  });

  describe('toKebabCase', () => {
    it('converts to kebab case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    it('handles multiple words', () => {
      expect(toKebabCase('helloWorldTest')).toBe('hello-world-test');
    });

    it('handles existing kebab case', () => {
      expect(toKebabCase('hello-world')).toBe('hello-world');
    });
  });

  describe('toSnakeCase', () => {
    it('converts to snake case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('handles multiple words', () => {
      expect(toSnakeCase('helloWorldTest')).toBe('hello_world_test');
    });

    it('handles existing snake case', () => {
      expect(toSnakeCase('hello_world')).toBe('hello_world');
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
    });

    it('preserves short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('uses custom suffix', () => {
      expect(truncate('Hello World', 5, '---')).toBe('He---');
    });

    it('handles empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });
});


