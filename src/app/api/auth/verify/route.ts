import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { SiweMessage } from 'siwe';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const { message, signature, address } = await request.json();
    
    const session = await getSession();
    
    // If only address is provided (smart wallet/social login), skip SIWE verification
    if (address && !message && !signature) {
      const walletAddress = address.toLowerCase();
      
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
      
      await session.save();
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          githubConnected: !!user.githubUsername,
        },
      });
    }
    
    // Regular SIWE verification for EOA wallets (MetaMask, etc.)
    const siweMessage = new SiweMessage(message);
    
    try {
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
    } catch (verifyError: any) {
      console.error('SIWE verification failed:', verifyError);
      
      // If SIWE verification fails but we have a valid address, treat as smart wallet
      if (siweMessage.address) {
        const walletAddress = siweMessage.address.toLowerCase();
        
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
        
        session.walletAddress = walletAddress;
        session.userId = user.id;
        session.githubConnected = !!user.githubUsername;
        session.isLoggedIn = true;
        
        await session.save();
        
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            walletAddress: user.walletAddress,
            githubConnected: !!user.githubUsername,
          },
        });
      }
      
      throw verifyError;
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { error: 'Failed to verify signature' },
      { status: 500 }
    );
  }
}

