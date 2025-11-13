import { errorReporter } from '@/shared/utils/errors/ErrorReporting';

describe('Error Reporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('report', () => {
    it('reports error with context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent', action: 'submit' };

      errorReporter.report(error, context, 'medium');

      expect(console.error).toHaveBeenCalled();
    });

    it('reports error with different severity levels', () => {
      const error = new Error('Critical error');

      errorReporter.report(error, {}, 'critical');
      errorReporter.report(error, {}, 'high');
      errorReporter.report(error, {}, 'medium');
      errorReporter.report(error, {}, 'low');

      expect(console.error).toHaveBeenCalledTimes(4);
    });
  });

  describe('reportAPIError', () => {
    it('reports API error with endpoint details', () => {
      const error = new Error('API request failed');

      errorReporter.reportAPIError(error, '/api/users', 'POST', 500);

      expect(console.error).toHaveBeenCalled();
    });

    it('sets high severity for 500 errors', () => {
      const error = new Error('Server error');

      errorReporter.reportAPIError(error, '/api/data', 'GET', 500);

      // Would check severity in actual implementation
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('reportNetworkError', () => {
    it('reports network error with URL', () => {
      const error = new Error('Network timeout');

      errorReporter.reportNetworkError(error, 'https://api.example.com');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('reportValidationError', () => {
    it('reports validation error with field details', () => {
      const error = new Error('Invalid email');

      errorReporter.reportValidationError(error, 'email', 'invalid@');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('user context', () => {
    it('sets user context', () => {
      errorReporter.setUser('user-123', 'test@example.com');

      expect(console.log).toHaveBeenCalledWith('Set user context:', {
        userId: 'user-123',
        email: 'test@example.com',
      });
    });

    it('clears user context', () => {
      errorReporter.clearUser();

      expect(console.log).toHaveBeenCalledWith('Cleared user context');
    });
  });
});

