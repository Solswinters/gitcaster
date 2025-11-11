import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { SiweMessage } from 'siwe';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json();
    
    const session = await getSession();
    const siweMessage = new SiweMessage(message);
    
    // Verify the signature
    const fields = await siweMessage.verify({ signature, nonce: session.siwe?.nonce });
    
    if (!fields.success) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    const walletAddress = siweMessage.address.toLowerCase();
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
        },
      });
    }
    
    // Update session
    session.walletAddress = walletAddress;
    session.userId = user.id;
    session.githubConnected = !!user.githubUsername;
    session.isLoggedIn = true;
    session.siwe = {
      address: walletAddress,
      chainId: siweMessage.chainId,
      nonce: session.siwe?.nonce || '',
      issuedAt: siweMessage.issuedAt || new Date().toISOString(),
    };
    
    await session.save();
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        githubConnected: !!user.githubUsername,
      },
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { error: 'Failed to verify signature' },
      { status: 500 }
    );
  }
}

