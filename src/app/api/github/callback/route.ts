import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { exchangeCodeForToken, GitHubClient } from '@/lib/github/client';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/onboarding?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/onboarding?error=no_code', request.url)
      );
    }

    // Get session
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.redirect(
        new URL('/onboarding?error=not_authenticated', request.url)
      );
    }

    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(code);

    // Get GitHub user info
    const githubClient = new GitHubClient(accessToken);
    const githubUser = await githubClient.getUser();

    // Update user with GitHub info and save access token
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        githubId: String(githubUser.id),
        githubUsername: githubUser.login,
        githubAccessToken: accessToken, // Save token for future syncs
      },
    });

    // Update session
    session.githubConnected = true;
    await session.save();

    // Redirect to sync page to fetch all GitHub data
    return NextResponse.redirect(new URL('/onboarding?step=sync', request.url));
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/onboarding?error=github_auth_failed', request.url)
    );
  }
}

