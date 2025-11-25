import { NextResponse } from 'next/server';
import { generateNonce } from 'siwe';

import { getSession } from '@/lib/session';

/**
 * GET utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GET.
 */
export async function GET() {
  try {
    const session = await getSession();
    const nonce = generateNonce();
    
    session.siwe = {
      ...session.siwe,
      nonce,
      address: '',
      chainId: 0,
      issuedAt: new Date().toISOString(),
    };
    
    await session.save();
    
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}

