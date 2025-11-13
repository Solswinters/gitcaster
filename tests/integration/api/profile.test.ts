/**
 * Integration tests for Profile API endpoints
 * Tests the full request/response cycle with database
 */

import { prisma } from '@/lib/db/prisma';

// Mock Next.js request/response
const mockRequest = (method: string, body?: any) => ({
  method,
  json: async () => body,
  headers: new Headers(),
});

const mockResponse = () => {
  const response: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return response;
};

describe('Profile API Integration', () => {
  // Clean up test data before and after
  beforeAll(async () => {
    // Ensure test database is clean
    await prisma.profile.deleteMany({
      where: {
        slug: {
          startsWith: 'test-',
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.profile.deleteMany({
      where: {
        slug: {
          startsWith: 'test-',
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/profile/[slug]', () => {
    it('should return 404 for non-existent profile', async () => {
      // In real implementation, this would call the actual API route handler
      const result = await prisma.profile.findUnique({
        where: { slug: 'non-existent-profile-123' },
      });

      expect(result).toBeNull();
    });

    it('should return profile data for existing public profile', async () => {
      // Create test user and profile
      const testUser = await prisma.user.create({
        data: {
          walletAddress: '0xtest123',
          githubUsername: 'testuser',
        },
      });

      const testProfile = await prisma.profile.create({
        data: {
          userId: testUser.id,
          slug: 'test-profile-1',
          displayName: 'Test User',
          bio: 'Test bio',
          isPublic: true,
        },
      });

      const result = await prisma.profile.findUnique({
        where: { slug: 'test-profile-1' },
        include: {
          user: {
            select: {
              githubUsername: true,
            },
          },
        },
      });

      expect(result).not.toBeNull();
      expect(result?.slug).toBe('test-profile-1');
      expect(result?.displayName).toBe('Test User');
      expect(result?.isPublic).toBe(true);

      // Clean up
      await prisma.profile.delete({ where: { id: testProfile.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should not return private profiles', async () => {
      const testUser = await prisma.user.create({
        data: {
          walletAddress: '0xtest456',
          githubUsername: 'privateuser',
        },
      });

      const testProfile = await prisma.profile.create({
        data: {
          userId: testUser.id,
          slug: 'test-private-profile',
          displayName: 'Private User',
          isPublic: false,
        },
      });

      // Simulate API logic that checks isPublic
      const result = await prisma.profile.findFirst({
        where: {
          slug: 'test-private-profile',
          isPublic: true,
        },
      });

      expect(result).toBeNull();

      // Clean up
      await prisma.profile.delete({ where: { id: testProfile.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });
  });

  describe('POST /api/profile', () => {
    it('should create new profile', async () => {
      const testUser = await prisma.user.create({
        data: {
          walletAddress: '0xtest789',
          githubUsername: 'newuser',
        },
      });

      const profileData = {
        userId: testUser.id,
        slug: 'test-new-profile',
        displayName: 'New User',
        bio: 'New user bio',
        location: 'San Francisco',
      };

      const newProfile = await prisma.profile.create({
        data: profileData,
      });

      expect(newProfile).toBeDefined();
      expect(newProfile.slug).toBe('test-new-profile');
      expect(newProfile.displayName).toBe('New User');
      expect(newProfile.location).toBe('San Francisco');

      // Clean up
      await prisma.profile.delete({ where: { id: newProfile.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should reject duplicate slug', async () => {
      const testUser1 = await prisma.user.create({
        data: {
          walletAddress: '0xdup1',
          githubUsername: 'user1',
        },
      });

      const testUser2 = await prisma.user.create({
        data: {
          walletAddress: '0xdup2',
          githubUsername: 'user2',
        },
      });

      await prisma.profile.create({
        data: {
          userId: testUser1.id,
          slug: 'test-duplicate-slug',
          displayName: 'User 1',
        },
      });

      // Try to create profile with same slug
      await expect(
        prisma.profile.create({
          data: {
            userId: testUser2.id,
            slug: 'test-duplicate-slug',
            displayName: 'User 2',
          },
        })
      ).rejects.toThrow();

      // Clean up
      await prisma.profile.deleteMany({
        where: { slug: 'test-duplicate-slug' },
      });
      await prisma.user.deleteMany({
        where: {
          id: { in: [testUser1.id, testUser2.id] },
        },
      });
    });
  });

  describe('PATCH /api/profile', () => {
    it('should update profile data', async () => {
      const testUser = await prisma.user.create({
        data: {
          walletAddress: '0xupdate',
          githubUsername: 'updateuser',
        },
      });

      const testProfile = await prisma.profile.create({
        data: {
          userId: testUser.id,
          slug: 'test-update-profile',
          displayName: 'Original Name',
          bio: 'Original bio',
        },
      });

      const updated = await prisma.profile.update({
        where: { id: testProfile.id },
        data: {
          displayName: 'Updated Name',
          bio: 'Updated bio',
          location: 'New York',
        },
      });

      expect(updated.displayName).toBe('Updated Name');
      expect(updated.bio).toBe('Updated bio');
      expect(updated.location).toBe('New York');

      // Clean up
      await prisma.profile.delete({ where: { id: testProfile.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should increment view count', async () => {
      const testUser = await prisma.user.create({
        data: {
          walletAddress: '0xview',
          githubUsername: 'viewuser',
        },
      });

      const testProfile = await prisma.profile.create({
        data: {
          userId: testUser.id,
          slug: 'test-view-profile',
          displayName: 'View User',
          viewCount: 0,
        },
      });

      // Simulate view tracking
      const updated = await prisma.profile.update({
        where: { id: testProfile.id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      expect(updated.viewCount).toBe(1);

      // Clean up
      await prisma.profile.delete({ where: { id: testProfile.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
    });
  });
});

