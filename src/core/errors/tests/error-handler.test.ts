/**
 * Error handler tests
 */

import { describe, it, expect } from '@jest/globals';
import { ErrorHandler } from '../error-handler';
import { AppError, ValidationError, NotFoundError } from '../base-error';

describe('ErrorHandler', () => {
  it('should handle AppError', () => {
    const error = new ValidationError('Invalid input');
    const response = ErrorHandler.handle(error);

    expect(response.message).toBe('Invalid input');
    expect(response.statusCode).toBe(400);
    expect(response.timestamp).toBeDefined();
  });

  it('should handle generic Error', () => {
    const error = new Error('Something went wrong');
    const response = ErrorHandler.handle(error);

    expect(response.message).toBe('Internal server error');
    expect(response.statusCode).toBe(500);
  });

  it('should identify operational errors', () => {
    const operationalError = new NotFoundError();
    const programmerError = new Error('Unexpected error');

    expect(ErrorHandler.isOperationalError(operationalError)).toBe(true);
    expect(ErrorHandler.isOperationalError(programmerError)).toBe(false);
  });

  it('should log errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Test error');
    
    ErrorHandler.logError(error, { userId: 'test-123' });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

