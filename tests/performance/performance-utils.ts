/**
 * Performance Testing Utilities
 * 
 * Utilities for measuring and asserting performance metrics.
 */

export interface PerformanceMetrics {
  duration: number;
  memory?: number;
  operations?: number;
}

export interface PerformanceBenchmark {
  name: string;
  iterations: number;
  totalDuration: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  standardDeviation: number;
}

/**
 * Measure execution time of a function
 */
export async function measureTime<T>(
  fn: () => Promise<T> | T
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  return { result, duration };
}

/**
 * Measure memory usage before and after function execution
 */
export async function measureMemory<T>(
  fn: () => Promise<T> | T
): Promise<{ result: T; memoryDelta: number }> {
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  const memBefore = process.memoryUsage().heapUsed;
  const result = await fn();
  const memAfter = process.memoryUsage().heapUsed;
  const memoryDelta = memAfter - memBefore;
  
  return { result, memoryDelta };
}

/**
 * Run a benchmark test
 */
export async function benchmark(
  name: string,
  fn: () => Promise<void> | void,
  iterations: number = 100
): Promise<PerformanceBenchmark> {
  const durations: number[] = [];
  
  // Warmup
  for (let i = 0; i < 5; i++) {
    await fn();
  }
  
  // Actual benchmark
  for (let i = 0; i < iterations; i++) {
    const { duration } = await measureTime(fn);
    durations.push(duration);
  }
  
  const totalDuration = durations.reduce((a, b) => a + b, 0);
  const averageDuration = totalDuration / iterations;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  
  // Calculate standard deviation
  const variance = durations.reduce((sum, duration) => {
    return sum + Math.pow(duration - averageDuration, 2);
  }, 0) / iterations;
  const standardDeviation = Math.sqrt(variance);
  
  return {
    name,
    iterations,
    totalDuration,
    averageDuration,
    minDuration,
    maxDuration,
    standardDeviation,
  };
}

/**
 * Assert that function executes within time limit
 */
export async function expectPerformance<T>(
  fn: () => Promise<T> | T,
  maxDuration: number,
  message?: string
): Promise<T> {
  const { result, duration } = await measureTime(fn);
  
  if (duration > maxDuration) {
    throw new Error(
      message || 
      `Performance assertion failed: ${duration.toFixed(2)}ms > ${maxDuration}ms`
    );
  }
  
  return result;
}

/**
 * Compare performance of multiple functions
 */
export async function comparePerformance(
  tests: Array<{ name: string; fn: () => Promise<void> | void }>,
  iterations: number = 100
): Promise<PerformanceBenchmark[]> {
  const results: PerformanceBenchmark[] = [];
  
  for (const test of tests) {
    const result = await benchmark(test.name, test.fn, iterations);
    results.push(result);
  }
  
  return results.sort((a, b) => a.averageDuration - b.averageDuration);
}

/**
 * Print benchmark results
 */
export function printBenchmark(benchmark: PerformanceBenchmark): void {
  console.log(`\n📊 Benchmark: ${benchmark.name}`);
  console.log(`   Iterations: ${benchmark.iterations}`);
  console.log(`   Average: ${benchmark.averageDuration.toFixed(3)}ms`);
  console.log(`   Min: ${benchmark.minDuration.toFixed(3)}ms`);
  console.log(`   Max: ${benchmark.maxDuration.toFixed(3)}ms`);
  console.log(`   Std Dev: ${benchmark.standardDeviation.toFixed(3)}ms`);
}

/**
 * Print comparison results
 */
export function printComparison(results: PerformanceBenchmark[]): void {
  console.log('\n🏆 Performance Comparison (fastest to slowest):');
  results.forEach((result, index) => {
    const relative = index === 0 ? '' : ` (${(result.averageDuration / results[0].averageDuration).toFixed(2)}x slower)`;
    console.log(`   ${index + 1}. ${result.name}: ${result.averageDuration.toFixed(3)}ms${relative}`);
  });
}

/**
 * Create a performance test suite
 */
export class PerformanceTestSuite {
  private tests: Array<{ name: string; fn: () => Promise<void> | void; maxDuration?: number }> = [];
  
  add(name: string, fn: () => Promise<void> | void, maxDuration?: number): this {
    this.tests.push({ name, fn, maxDuration });
    return this;
  }
  
  async run(iterations: number = 100): Promise<void> {
    console.log(`\n🚀 Running performance test suite (${this.tests.length} tests, ${iterations} iterations each)\n`);
    
    for (const test of this.tests) {
      const result = await benchmark(test.name, test.fn, iterations);
      printBenchmark(result);
      
      if (test.maxDuration && result.averageDuration > test.maxDuration) {
        console.log(`   ❌ FAILED: Average duration ${result.averageDuration.toFixed(3)}ms exceeds limit ${test.maxDuration}ms`);
      } else {
        console.log(`   ✅ PASSED`);
      }
    }
  }
}

/**
 * Create a new performance test suite
 */
export function createPerformanceSuite(): PerformanceTestSuite {
  return new PerformanceTestSuite();
}



