import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';

/**
 * POST utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of POST.
 */
export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

