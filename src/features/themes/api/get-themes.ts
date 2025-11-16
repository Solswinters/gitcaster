/**
 * Get themes API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { ThemeService } from '../services';

export async function GET(req: NextRequest) {
  try {
    const themes = ThemeService.getAllThemes();
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Get themes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

