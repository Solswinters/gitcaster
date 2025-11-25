import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db/prisma';

// One-time endpoint to fix existing profile slugs
export async function POST() {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.profile) {
      return NextResponse.json(
        { error: 'No profile found' },
        { status: 404 }
      );
    }

    // Update profile slug to wallet address and set isPublic
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: {
        slug: user.walletAddress.toLowerCase(),
        isPublic: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile slug updated successfully',
      oldSlug: user.profile.slug,
      newSlug: user.walletAddress.toLowerCase(),
    });
  } catch (error: any) {
    console.error('Error fixing profile slug:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fix profile slug' },
      { status: 500 }
    );
  }
}

