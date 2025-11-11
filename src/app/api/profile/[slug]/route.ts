import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const profile = await prisma.profile.findUnique({
      where: { slug },
      include: {
        user: {
          include: {
            githubStats: true,
          },
        },
      },
    });

    if (!profile || !profile.isPublic) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      profile: {
        slug: profile.slug,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        location: profile.location,
        company: profile.company,
        website: profile.website,
        walletAddress: profile.user.walletAddress,
        githubUsername: profile.user.githubUsername,
        talentScore: profile.talentScore,
        talentPassportData: profile.talentPassportData,
        viewCount: profile.viewCount + 1,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
        githubStats: profile.user.githubStats
          ? {
              publicRepos: profile.user.githubStats.publicRepos,
              totalStars: profile.user.githubStats.totalStars,
              totalForks: profile.user.githubStats.totalForks,
              totalCommits: profile.user.githubStats.totalCommits,
              totalPRs: profile.user.githubStats.totalPRs,
              totalIssues: profile.user.githubStats.totalIssues,
              totalContributions: profile.user.githubStats.totalContributions,
              languages: profile.user.githubStats.languages,
              contributionGraph: profile.user.githubStats.contributionGraph,
              topRepositories: profile.user.githubStats.topRepositories,
              recentActivity: profile.user.githubStats.recentActivity,
              lastSyncedAt: profile.user.githubStats.lastSyncedAt.toISOString(),
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

