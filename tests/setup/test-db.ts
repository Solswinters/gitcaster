/**
 * Test database setup and teardown utilities
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/gitcaster_test',
    },
  },
})

/**
 * Clear all data from test database
 */
export async function clearDatabase() {
  const tables = ['User']
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
    } catch (error) {
      console.error(`Error clearing table ${table}:`, error)
    }
  }
}

/**
 * Seed test database with sample data
 */
export async function seedDatabase() {
  await prisma.user.createMany({
    data: [
      {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        githubUsername: 'testuser1',
        githubAccessToken: 'gho_test_token_1',
      },
      {
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        githubUsername: 'testuser2',
        githubAccessToken: 'gho_test_token_2',
      },
    ],
  })
}

/**
 * Setup test database before tests
 */
export async function setupTestDatabase() {
  await clearDatabase()
  await seedDatabase()
}

/**
 * Cleanup test database after tests
 */
export async function teardownTestDatabase() {
  await clearDatabase()
  await prisma.$disconnect()
}

export { prisma as testPrisma }

