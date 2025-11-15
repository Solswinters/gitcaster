/**
 * Database Test Helper
 * 
 * Utilities for managing database state in integration tests.
 */

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

/**
 * Get Prisma client for tests
 */
export function getTestPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/gitcaster_test',
        },
      },
    });
  }
  return prisma;
}

/**
 * Clean all database tables
 */
export async function cleanDatabase(): Promise<void> {
  const prisma = getTestPrisma();
  
  // Delete in reverse order of dependencies
  await prisma.$transaction([
    prisma.session.deleteMany(),
    prisma.analyticsEvent.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

/**
 * Seed test data
 */
export async function seedTestData(data: any): Promise<void> {
  const prisma = getTestPrisma();
  
  if (data.users) {
    for (const user of data.users) {
      await prisma.user.create({ data: user });
    }
  }
  
  if (data.profiles) {
    for (const profile of data.profiles) {
      await prisma.profile.create({ data: profile });
    }
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

/**
 * Execute raw SQL
 */
export async function executeSQL(sql: string): Promise<any> {
  const prisma = getTestPrisma();
  return await prisma.$executeRawUnsafe(sql);
}

/**
 * Create database transaction for test
 */
export async function withTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = getTestPrisma();
  
  return await prisma.$transaction(async (tx) => {
    return await callback(tx as PrismaClient);
  });
}

