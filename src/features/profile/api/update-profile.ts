/**
 * Update profile API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '../services';
import type { Profile } from '../types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = params;
    const updates: Partial<Profile> = await req.json();

    // Validate updates
    const validation = ProfileService.validateProfile(updates);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // TODO: Update in database
    // const updated = await prisma.profile.update({
    //   where: { id: profileId },
    //   data: updates
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

