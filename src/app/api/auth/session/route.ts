import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db/prisma';

/**
 * GET utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GET.
 */
export async function GET() {
  try {
    const session = await getSession();
    
    let hasGithubToken = false;
    
    // Check if user has a stored GitHub token
    if (session.userId) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { githubAccessToken: true },
      });
      hasGithubToken = !!user?.githubAccessToken;
    }
    
    return NextResponse.json({
      isLoggedIn: session.isLoggedIn || false,
      walletAddress: session.walletAddress,
      userId: session.userId,
      githubConnected: session.githubConnected || false,
      hasGithubToken,
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

