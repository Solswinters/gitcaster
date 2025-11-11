import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    
    return NextResponse.json({
      isLoggedIn: session.isLoggedIn || false,
      walletAddress: session.walletAddress,
      userId: session.userId,
      githubConnected: session.githubConnected || false,
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

