import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { generateNonce } from 'siwe';

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

