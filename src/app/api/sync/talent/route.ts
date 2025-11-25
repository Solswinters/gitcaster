import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { getTalentProtocolScore } from '@/lib/talent-protocol/client';
import { prisma } from '@/lib/db/prisma';

/**
 * POST utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of POST.
 */
export async function POST() {
  try {
    const session = await getSession();

    if (!session.userId || !session.walletAddress) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Create sync log
    const syncLog = await prisma.syncLog.create({
      data: {
        userId: session.userId,
        syncType: 'talent-protocol',
        status: 'in-progress',
      },
    });

    try {
      // Fetch Talent Protocol score
      const talentData = await getTalentProtocolScore(session.walletAddress);

      if (!talentData) {
        await prisma.syncLog.update({
          where: { id: syncLog.id },
          data: {
            status: 'success',
            message: 'No Talent Protocol passport found - this is optional',
          },
        });

        return NextResponse.json({
          success: true,
          hasPassport: false,
          message: 'No Talent Protocol passport found. You can create one at https://talentprotocol.com',
        });
      }

      // Update profile with Talent Protocol data
      const profile = await prisma.profile.findUnique({
        where: { userId: session.userId },
      });

      if (profile) {
        await prisma.profile.update({
          where: { userId: session.userId },
          data: {
            talentScore: talentData.score,
            talentPassportData: talentData as any,
          },
        });
      }

      // Update sync log
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'success',
          message: 'Talent Protocol data synced successfully',
        },
      });

      return NextResponse.json({
        success: true,
        score: talentData.score,
      });
    } catch (error: any) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'error',
          message: error.message,
        },
      });

      throw error;
    }
  } catch (error: any) {
    console.error('Talent Protocol sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync Talent Protocol data' },
      { status: 500 }
    );
  }
}

