/**
 * GitHub API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { GitHubClient } from '../services';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const client = new GitHubClient(process.env.GITHUB_TOKEN);
    
    const user = await client.getUser(username);
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}

