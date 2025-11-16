/**
 * Tests for API middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { composeMiddleware, withErrorHandling, cors } from '../middleware';

describe('API Middleware', () => {
  describe('composeMiddleware', () => {
    it('executes middlewares in order', async () => {
      const order: number[] = [];
      
      const middleware1 = async () => {
        order.push(1);
        return null;
      };
      
      const middleware2 = async () => {
        order.push(2);
        return null;
      };
      
      const composed = composeMiddleware(middleware1, middleware2);
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      
      await composed(mockRequest);
      
      expect(order).toEqual([1, 2]);
    });

    it('stops execution when middleware returns response', async () => {
      const order: number[] = [];
      
      const middleware1 = async () => {
        order.push(1);
        return NextResponse.json({ message: 'stopped' });
      };
      
      const middleware2 = async () => {
        order.push(2);
        return null;
      };
      
      const composed = composeMiddleware(middleware1, middleware2);
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      
      const result = await composed(mockRequest);
      
      expect(order).toEqual([1]);
      expect(result).not.toBeNull();
    });
  });

  describe('withErrorHandling', () => {
    it('handles successful responses', async () => {
      const handler = async () => {
        return NextResponse.json({ success: true });
      };
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      const response = await withErrorHandling(handler, mockRequest);
      const data = await response.json();
      
      expect(data.success).toBe(true);
    });

    it('catches and handles errors', async () => {
      const handler = async () => {
        throw new Error('Test error');
      };
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      const response = await withErrorHandling(handler, mockRequest);
      
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('cors', () => {
    it('allows requests from allowed origins', () => {
      process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          origin: 'http://localhost:3000',
        },
      });
      
      const response = cors(mockRequest);
      
      expect(response).not.toBeNull();
      expect(response?.headers.get('Access-Control-Allow-Origin')).toBe(
        'http://localhost:3000'
      );
    });

    it('blocks requests from disallowed origins', () => {
      process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          origin: 'http://evil.com',
        },
      });
      
      const response = cors(mockRequest);
      
      expect(response).toBeNull();
    });
  });
});

