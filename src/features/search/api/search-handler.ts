/**
 * Search API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { SearchEngine } from '../services';
import { SearchQueryBuilder } from '../domain';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = SearchQueryBuilder.fromUrl(searchParams);
    
    const results = await SearchEngine.search(query);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

