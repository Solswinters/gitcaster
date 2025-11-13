/**
 * Database connection pool management
 * Optimizes Prisma Client connections for serverless and production
 */

import { PrismaClient } from '@prisma/client';

interface PrismaClientOptions {
  log?: Array<'query' | 'error' | 'info' | 'warn'>;
  datasources?: {
    db?: {
      url?: string;
    };
  };
}

// Global Prisma instance for connection reuse
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Create Prisma Client with optimized settings
 */
function createPrismaClient(): PrismaClient {
  const options: PrismaClientOptions = {
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] 
      : ['error'],
  };

  // Connection pooling configuration for production
  if (process.env.NODE_ENV === 'production') {
    const url = new URL(process.env.DATABASE_URL || '');
    
    // Add connection pool parameters if not present
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '10');
    }
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', '10');
    }

    options.datasources = {
      db: {
        url: url.toString(),
      },
    };
  }

  const client = new PrismaClient(options);

  // Add query logging middleware in development
  if (process.env.NODE_ENV === 'development') {
    client.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      
      console.log(`[Prisma Query] ${params.model}.${params.action} took ${after - before}ms`);
      
      return result;
    });
  }

  // Add error logging middleware
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error) {
      console.error('[Prisma Error]', {
        model: params.model,
        action: params.action,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  });

  return client;
}

/**
 * Get Prisma Client instance (singleton pattern for connection reuse)
 */
export function getPrismaClient(): PrismaClient {
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  return global.__prisma;
}

/**
 * Disconnect Prisma Client (useful for cleanup in tests)
 */
export async function disconnectPrisma(): Promise<void> {
  if (global.__prisma) {
    await global.__prisma.$disconnect();
    global.__prisma = undefined;
  }
}

/**
 * Check database connection health
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  latency?: number;
  error?: string;
}> {
  const client = getPrismaClient();
  
  try {
    const start = Date.now();
    await client.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    
    return {
      healthy: true,
      latency,
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get connection pool metrics
 */
export async function getConnectionMetrics(): Promise<{
  activeConnections: number;
  idleConnections: number;
}> {
  const client = getPrismaClient();
  
  try {
    // Query pg_stat_activity for connection info (PostgreSQL specific)
    const result = await client.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*) as count 
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `;
    
    const activeConnections = result[0]?.count || 0;
    
    return {
      activeConnections,
      idleConnections: 0, // Would need more complex query for idle connections
    };
  } catch (error) {
    console.error('Failed to get connection metrics:', error);
    return {
      activeConnections: 0,
      idleConnections: 0,
    };
  }
}

/**
 * Execute query with automatic retry
 */
export async function executeWithRetry<T>(
  operation: (client: PrismaClient) => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  const client = getPrismaClient();
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation(client);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries) {
        console.warn(`Query failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

/**
 * Batch operations for better performance
 */
export async function batchCreate<T>(
  model: any,
  data: any[],
  batchSize: number = 100
): Promise<T[]> {
  const client = getPrismaClient();
  const results: T[] = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchResults = await model.createMany({
      data: batch,
      skipDuplicates: true,
    });
    results.push(...(batchResults as unknown as T[]));
  }
  
  return results;
}

