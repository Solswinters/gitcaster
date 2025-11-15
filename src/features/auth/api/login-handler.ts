/**
 * Login API handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const result = await AuthService.loginWithEmail({ email, password });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 401 }
    );
  }
}

