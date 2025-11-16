/**
 * Job posting API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { RecruiterService } from '../services';

export async function GET(
  req: NextRequest,
  { params }: { params: { recruiterId: string } }
) {
  try {
    const { recruiterId } = params;
    const postings = await RecruiterService.getJobPostings(recruiterId);

    return NextResponse.json(postings);
  } catch (error) {
    console.error('Get job postings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job postings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const postingData = await req.json();
    const posting = await RecruiterService.createJobPosting(postingData);

    return NextResponse.json(posting);
  } catch (error) {
    console.error('Create job posting error:', error);
    return NextResponse.json(
      { error: 'Failed to create job posting' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { postingId: string } }
) {
  try {
    const { postingId } = params;
    const updates = await req.json();
    const posting = await RecruiterService.updateJobPosting(postingId, updates);

    if (!posting) {
      return NextResponse.json(
        { error: 'Job posting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(posting);
  } catch (error) {
    console.error('Update job posting error:', error);
    return NextResponse.json(
      { error: 'Failed to update job posting' },
      { status: 500 }
    );
  }
}

