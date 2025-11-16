/**
 * Recruiter API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { RecruiterService } from '../services';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const profile = await RecruiterService.getProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Recruiter profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Get recruiter profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recruiter profile' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const profileData = await req.json();
    const profile = await RecruiterService.saveProfile(profileData);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Save recruiter profile error:', error);
    return NextResponse.json(
      { error: 'Failed to save recruiter profile' },
      { status: 500 }
    );
  }
}

