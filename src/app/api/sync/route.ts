import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db/prisma';
import { GitHubClient, exchangeCodeForToken } from '@/lib/github/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user with GitHub token
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { githubStats: true, profile: true },
    });

    if (!user || !user.githubUsername) {
      return NextResponse.json(
        { error: 'GitHub not connected' },
        { status: 400 }
      );
    }

    // Create sync log
    const syncLog = await prisma.syncLog.create({
      data: {
        userId: user.id,
        syncType: 'github',
        status: 'in-progress',
      },
    });

    try {
      // Use stored GitHub access token, with fallback to request body
      let githubToken = user.githubAccessToken;
      
      // If no stored token, check request body (for manual token entry or first-time setup)
      if (!githubToken) {
        const body = await request.json().catch(() => ({}));
        githubToken = body.githubToken;
        
        // If token provided in request, save it for future use
        if (githubToken) {
          await prisma.user.update({
            where: { id: user.id },
            data: { githubAccessToken: githubToken },
          });
        }
      }
      
      if (!githubToken) {
        throw new Error('GitHub token required. Please reconnect your GitHub account or provide a personal access token.');
      }

      const githubClient = new GitHubClient(githubToken);

      // Fetch all GitHub data
      const [githubUser, repos, commits, pullRequests, issues] = await Promise.all([
        githubClient.getUser(),
        githubClient.getRepositories(),
        githubClient.getCommits(user.githubUsername),
        githubClient.getPullRequests(user.githubUsername),
        githubClient.getIssues(user.githubUsername),
      ]);

      const languages = await githubClient.getLanguageStats(repos);
      const contributionGraph = await githubClient.getContributionGraph(user.githubUsername);

      // Calculate stats
      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

      // Store top repositories
      const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          language: repo.language,
          topics: repo.topics,
        }));

      // Store recent activity
      const recentActivity = [
        ...commits.slice(0, 10).map(c => ({ type: 'commit', ...c })),
        ...pullRequests.slice(0, 5).map(pr => ({ type: 'pr', ...pr })),
        ...issues.slice(0, 5).map(i => ({ type: 'issue', ...i })),
      ]
        .sort((a: any, b: any) => {
          const dateA = new Date(a.commit?.author?.date || a.created_at);
          const dateB = new Date(b.commit?.author?.date || b.created_at);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 20);

      // Upsert GitHub stats
      await prisma.gitHubStats.upsert({
        where: { userId: user.id },
        update: {
          publicRepos: repos.length,
          publicGists: githubUser.public_gists,
          followers: githubUser.followers,
          following: githubUser.following,
          totalStars,
          totalForks,
          totalCommits: commits.length,
          totalPRs: pullRequests.length,
          totalIssues: issues.length,
          totalContributions: contributionGraph.reduce((sum, day) => sum + day.count, 0),
          languages: languages as any,
          contributionGraph: contributionGraph as any,
          topRepositories: topRepos as any,
          recentActivity: recentActivity as any,
          lastSyncedAt: new Date(),
        },
        create: {
          userId: user.id,
          publicRepos: repos.length,
          publicGists: githubUser.public_gists,
          followers: githubUser.followers,
          following: githubUser.following,
          totalStars,
          totalForks,
          totalCommits: commits.length,
          totalPRs: pullRequests.length,
          totalIssues: issues.length,
          totalContributions: contributionGraph.reduce((sum, day) => sum + day.count, 0),
          languages: languages as any,
          contributionGraph: contributionGraph as any,
          topRepositories: topRepos as any,
          recentActivity: recentActivity as any,
        },
      });

      // Create or update profile
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          displayName: githubUser.name || user.githubUsername,
          bio: githubUser.bio,
          avatarUrl: githubUser.avatar_url,
          location: githubUser.location,
          company: githubUser.company,
          website: githubUser.blog,
          slug: user.githubUsername || user.id,
        },
        create: {
          userId: user.id,
          displayName: githubUser.name || user.githubUsername,
          bio: githubUser.bio,
          avatarUrl: githubUser.avatar_url,
          location: githubUser.location,
          company: githubUser.company,
          website: githubUser.blog,
          slug: user.githubUsername || user.id,
        },
      });

      // Update sync log
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'success',
          message: 'GitHub data synced successfully',
        },
      });

      return NextResponse.json({
        success: true,
        stats: {
          repos: repos.length,
          commits: commits.length,
          prs: pullRequests.length,
          issues: issues.length,
        },
      });
    } catch (error: any) {
      // Update sync log with error
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
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync data' },
      { status: 500 }
    );
  }
}

