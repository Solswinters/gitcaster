/**
 * Example Performance Tests
 * 
 * Examples of how to write performance tests.
 */

import {
  measureTime,
  benchmark,
  comparePerformance,
  expectPerformance,
  createPerformanceSuite,
  printBenchmark,
  printComparison,
} from './performance-utils';

describe('Performance Tests', () => {
  describe('measureTime', () => {
    it('measures execution time', async () => {
      const { duration } = await measureTime(() => {
        // Simulate some work
        for (let i = 0; i < 1000; i++) {
          Math.sqrt(i);
        }
      });
      
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe('expectPerformance', () => {
    it('passes when within time limit', async () => {
      await expectPerformance(
        () => {
          const arr = Array.from({ length: 100 }, (_, i) => i);
          return arr.map(x => x * 2);
        },
        10 // Should complete in under 10ms
      );
    });

    it('throws when exceeding time limit', async () => {
      await expect(
        expectPerformance(
          () => {
            // Intentionally slow operation
            for (let i = 0; i < 10000000; i++) {
              Math.sqrt(i);
            }
          },
          1 // Unrealistic limit
        )
      ).rejects.toThrow('Performance assertion failed');
    });
  });

  describe('benchmark', () => {
    it('runs benchmark with iterations', async () => {
      const result = await benchmark(
        'Array operations',
        () => {
          const arr = Array.from({ length: 100 }, (_, i) => i);
          return arr.map(x => x * 2).filter(x => x > 50);
        },
        50
      );
      
      expect(result.iterations).toBe(50);
      expect(result.averageDuration).toBeGreaterThan(0);
      expect(result.minDuration).toBeLessThanOrEqual(result.averageDuration);
      expect(result.maxDuration).toBeGreaterThanOrEqual(result.averageDuration);
      
      printBenchmark(result);
    });
  });

  describe('comparePerformance', () => {
    it('compares multiple implementations', async () => {
      const results = await comparePerformance([
        {
          name: 'for loop',
          fn: () => {
            const arr = [];
            for (let i = 0; i < 100; i++) {
              arr.push(i * 2);
            }
          },
        },
        {
          name: 'Array.from + map',
          fn: () => {
            Array.from({ length: 100 }, (_, i) => i * 2);
          },
        },
        {
          name: 'spread + map',
          fn: () => {
            [...Array(100).keys()].map(i => i * 2);
          },
        },
      ], 100);
      
      expect(results).toHaveLength(3);
      // Results should be sorted by speed
      expect(results[0].averageDuration).toBeLessThanOrEqual(results[1].averageDuration);
      
      printComparison(results);
    });
  });

  describe('PerformanceTestSuite', () => {
    it('runs a suite of performance tests', async () => {
      const suite = createPerformanceSuite()
        .add('Test 1', () => {
          Array.from({ length: 50 }, (_, i) => i);
        }, 5)
        .add('Test 2', () => {
          Array.from({ length: 100 }, (_, i) => i);
        }, 10);
      
      await suite.run(50);
    });
  });
});

// Example: Real-world performance test
describe('API Response Parsing Performance', () => {
  const sampleData = {
    users: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
    })),
  };

  it('parses JSON efficiently', async () => {
    await expectPerformance(
      () => {
        const json = JSON.stringify(sampleData);
        const parsed = JSON.parse(json);
        return parsed;
      },
      5 // Should complete in under 5ms
    );
  });

  it('filters data efficiently', async () => {
    await expectPerformance(
      () => {
        return sampleData.users.filter(u => u.id > 50);
      },
      2 // Should complete in under 2ms
    );
  });
});

