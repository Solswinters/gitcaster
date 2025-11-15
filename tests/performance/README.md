# Performance Testing

Performance tests help ensure the application meets performance requirements and identify bottlenecks.

## Running Performance Tests

```bash
# Run performance tests
npm run test:perf

# Run with more iterations for accurate results
PERF_ITERATIONS=1000 npm run test:perf

# Run specific performance test
npm test -- tests/performance/api.perf.test.ts
```

## Writing Performance Tests

### Basic Time Measurement

```typescript
import { measureTime } from './performance-utils';

test('function performance', async () => {
  const { result, duration } = await measureTime(async () => {
    return await myExpensiveFunction();
  });
  
  console.log(`Completed in ${duration}ms`);
  expect(duration).toBeLessThan(100);
});
```

### Performance Assertions

```typescript
import { expectPerformance } from './performance-utils';

test('must complete quickly', async () => {
  const result = await expectPerformance(
    () => processData(largeDataset),
    50 // Must complete in under 50ms
  );
  
  expect(result).toBeDefined();
});
```

### Benchmarking

```typescript
import { benchmark, printBenchmark } from './performance-utils';

test('benchmark data processing', async () => {
  const result = await benchmark(
    'Data Processing',
    () => processLargeArray(data),
    1000 // Run 1000 iterations
  );
  
  printBenchmark(result);
  
  expect(result.averageDuration).toBeLessThan(10);
});
```

### Comparing Implementations

```typescript
import { comparePerformance, printComparison } from './performance-utils';

test('compare sorting algorithms', async () => {
  const data = generateRandomArray(1000);
  
  const results = await comparePerformance([
    {
      name: 'Built-in sort',
      fn: () => [...data].sort((a, b) => a - b),
    },
    {
      name: 'Custom quicksort',
      fn: () => quickSort([...data]),
    },
  ], 100);
  
  printComparison(results);
});
```

### Test Suites

```typescript
import { createPerformanceSuite } from './performance-utils';

describe('API Performance', () => {
  it('meets performance requirements', async () => {
    const suite = createPerformanceSuite()
      .add('GET /users', () => fetchUsers(), 100)
      .add('POST /users', () => createUser(data), 200)
      .add('PUT /users/:id', () => updateUser(id, data), 150);
    
    await suite.run(100);
  });
});
```

## Performance Budgets

### API Response Times

- **Fast**: < 100ms
- **Acceptable**: < 500ms
- **Slow**: > 500ms

### Database Queries

- **Simple queries**: < 10ms
- **Complex queries**: < 100ms
- **Aggregations**: < 500ms

### Frontend Operations

- **State updates**: < 16ms (60fps)
- **List rendering**: < 100ms
- **Page transitions**: < 200ms

### Data Processing

- **Small datasets (< 100 items)**: < 10ms
- **Medium datasets (< 1000 items)**: < 100ms
- **Large datasets (> 1000 items)**: < 1000ms

## Best Practices

### 1. Consistent Environment

Run performance tests in consistent environment:
- Same machine/CI environment
- No other processes running
- Fixed data size

### 2. Warmup Runs

Always do warmup runs before measuring:
```typescript
// Warmup
for (let i = 0; i < 5; i++) {
  await fn();
}

// Measure
const result = await benchmark(fn, 100);
```

### 3. Multiple Iterations

Use enough iterations for statistical significance:
- Fast operations: 1000+ iterations
- Slow operations: 100+ iterations
- Very slow operations: 10+ iterations

### 4. Realistic Data

Use realistic data sizes and complexity:
```typescript
const realisticUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  // ... full user object
};
```

### 5. Monitor Trends

Track performance over time:
- Record baseline metrics
- Compare against previous runs
- Alert on regressions

## Common Patterns

### API Endpoint Performance

```typescript
describe('API Performance', () => {
  it('/api/users GET', async () => {
    await expectPerformance(
      () => fetch('/api/users').then(r => r.json()),
      100
    );
  });
});
```

### Database Query Performance

```typescript
describe('Database Performance', () => {
  it('finds user by ID', async () => {
    await expectPerformance(
      () => prisma.user.findUnique({ where: { id: '123' } }),
      10
    );
  });
});
```

### Algorithm Performance

```typescript
describe('Algorithm Performance', () => {
  it('sorts large array', async () => {
    const arr = generateRandomArray(10000);
    
    await expectPerformance(
      () => quickSort(arr),
      100
    );
  });
});
```

## Profiling

For deeper performance analysis:

### Node.js Profiler

```bash
node --prof app.js
node --prof-process isolate-*.log > profile.txt
```

### Chrome DevTools

1. Add `--inspect` flag
2. Open chrome://inspect
3. Record performance profile

### Memory Profiling

```typescript
import { measureMemory } from './performance-utils';

test('memory usage', async () => {
  const { memoryDelta } = await measureMemory(() => {
    // Your code here
  });
  
  console.log(`Memory used: ${memoryDelta / 1024 / 1024}MB`);
  expect(memoryDelta).toBeLessThan(10 * 1024 * 1024); // < 10MB
});
```

## CI Integration

Add performance tests to CI:

```yaml
# .github/workflows/performance.yml
- name: Run performance tests
  run: npm run test:perf
  
- name: Upload results
  uses: actions/upload-artifact@v2
  with:
    name: performance-results
    path: performance-results.json
```

## Troubleshooting

### Flaky Performance Tests

If tests are inconsistent:
1. Increase iterations
2. Use wider thresholds
3. Run on dedicated hardware
4. Account for warmup

### Slow Tests

If performance tests are too slow:
1. Reduce iterations
2. Run only on CI
3. Run in parallel
4. Sample large datasets

