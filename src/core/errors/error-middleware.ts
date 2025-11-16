/**
 * Error handling middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { ErrorHandler } from './error-handler';
import { AppError } from './base-error';

export async function errorMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<(req: NextRequest) => Promise<NextResponse>> {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      const errorResponse = ErrorHandler.handle(error as Error);
      
      return NextResponse.json(
        {
          error: errorResponse.message,
          statusCode: errorResponse.statusCode,
          timestamp: errorResponse.timestamp,
          ...(process.env.NODE_ENV === 'development' && { stack: errorResponse.stack }),
        },
        { status: errorResponse.statusCode }
      );
    }
  };
}

export function handleApiError(error: unknown): NextResponse {
  const errorResponse = ErrorHandler.handle(error as Error);
  
  return NextResponse.json(
    {
      error: errorResponse.message,
      timestamp: errorResponse.timestamp,
    },
    { status: errorResponse.statusCode }
  );
}

export function createErrorResponse(
  message: string,
  statusCode: number = 500
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

