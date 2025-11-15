/**
 * Get profile API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '../services';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // TODO: Fetch from database
    // const profile = await prisma.profile.findUnique({ where: { githubUsername: username }});

    const mockProfile = {
      id: '1',
      userId: '1',
      githubUsername: username,
      displayName: username,
      bio: 'Software Developer',
      skills: ['TypeScript', 'React', 'Node.js'],
      experience: [],
      education: [],
      socialLinks: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const formatted = ProfileService.formatProfile(mockProfile as any);
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

