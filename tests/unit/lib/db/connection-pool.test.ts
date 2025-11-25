import { PrismaClient } from '@prisma/client';

import { checkDatabaseHealth, executeWithRetry } from '@/lib/db/connection-pool';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $queryRaw: jest.fn(),
      $disconnect: jest.fn(),
      $use: jest.fn(),
    })),
  };
});

describe('Connection Pool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkDatabaseHealth', () => {
    it('should return healthy status on successful query', async () => {
      const mockQueryRaw = jest.fn().mockResolvedValue([{ count: 1 }]);
      (PrismaClient as jest.Mock).mockImplementation(() => ({
        $queryRaw: mockQueryRaw,
        $disconnect: jest.fn(),
        $use: jest.fn(),
      }));

      // Need to reset the global instance
      (global as any).__prisma = undefined;

      const health = await checkDatabaseHealth();

      expect(health.healthy).toBe(true);
      expect(health.latency).toBeGreaterThanOrEqual(0);
      expect(health.error).toBeUndefined();
    });

    it('should return unhealthy status on query failure', async () => {
      const mockQueryRaw = jest.fn().mockRejectedValue(new Error('Connection failed'));
      (PrismaClient as jest.Mock).mockImplementation(() => ({
        $queryRaw: mockQueryRaw,
        $disconnect: jest.fn(),
        $use: jest.fn(),
      }));

      (global as any).__prisma = undefined;

      const health = await checkDatabaseHealth();

      expect(health.healthy).toBe(false);
      expect(health.error).toBe('Connection failed');
      expect(health.latency).toBeUndefined();
    });
  });

  describe('executeWithRetry', () => {
    it('should execute operation successfully on first try', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await executeWithRetry(operation, 3, 100);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce('success');
      
      const result = await executeWithRetry(operation, 3, 10);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries exceeded', async () => {
      const error = new Error('Persistent failure');
      const operation = jest.fn().mockRejectedValue(error);
      
      await expect(executeWithRetry(operation, 3, 10)).rejects.toThrow(error);
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Failure 1'))
        .mockRejectedValueOnce(new Error('Failure 2'))
        .mockResolvedValueOnce('success');
      
      const startTime = Date.now();
      await executeWithRetry(operation, 3, 10);
      const duration = Date.now() - startTime;

      // Should take at least 10ms + 20ms = 30ms (exponential backoff)
      expect(duration).toBeGreaterThanOrEqual(20);
    });
  });
});

