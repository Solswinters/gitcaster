import { StructuredLogger, LogLevel } from '@/lib/logging/structured-logger';

describe('Structured Logger', () => {
  let logger: StructuredLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new StructuredLogger({
      enableConsole: true,
      enableFile: false,
      pretty: false,
    });
    
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    logger.clearBuffer();
  });

  describe('Log levels', () => {
    it('should log debug messages', () => {
      logger.debug('Debug message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe('DEBUG');
      expect(logEntry.message).toBe('Debug message');
    });

    it('should log info messages', () => {
      logger.info('Info message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe('INFO');
      expect(logEntry.message).toBe('Info message');
    });

    it('should log warning messages', () => {
      logger.warn('Warning message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe('WARN');
      expect(logEntry.message).toBe('Warning message');
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Error message', error);

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe('ERROR');
      expect(logEntry.message).toBe('Error message');
      expect(logEntry.context.error.message).toBe('Test error');
    });

    it('should log fatal messages', () => {
      const error = new Error('Fatal error');
      logger.fatal('Fatal message', error);

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe('FATAL');
      expect(logEntry.message).toBe('Fatal message');
    });
  });

  describe('Context and metadata', () => {
    it('should include context in logs', () => {
      logger.info('Message with context', { userId: '123', action: 'login' });

      expect(consoleLogSpy).toHaveBeenCalled();
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.context.userId).toBe('123');
      expect(logEntry.context.action).toBe('login');
    });

    it('should include error details', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack trace';
      
      logger.error('Error occurred', error, { operation: 'database' });

      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.context.error.name).toBe('Error');
      expect(logEntry.context.error.message).toBe('Test error');
      expect(logEntry.context.error.stack).toBe('Error stack trace');
      expect(logEntry.context.operation).toBe('database');
    });
  });

  describe('Log level filtering', () => {
    it('should filter logs below configured level', () => {
      logger.setLevel(LogLevel.WARN);

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.level).toBe('WARN');
    });

    it('should allow all logs with DEBUG level', () => {
      logger.setLevel(LogLevel.DEBUG);

      logger.debug('Debug');
      logger.info('Info');
      logger.warn('Warn');
      logger.error('Error');

      expect(consoleLogSpy).toHaveBeenCalledTimes(4);
    });

    it('should only show errors with ERROR level', () => {
      logger.setLevel(LogLevel.ERROR);

      logger.debug('Debug');
      logger.info('Info');
      logger.warn('Warn');
      logger.error('Error');
      logger.fatal('Fatal');

      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Child logger', () => {
    it('should create child logger with context', () => {
      const child = logger.createChild({ component: 'auth' });
      child.info('Login attempt', { username: 'john' });

      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.context.component).toBe('auth');
      expect(logEntry.context.username).toBe('john');
    });

    it('should merge child context with message context', () => {
      const child = logger.createChild({ service: 'api' });
      child.warn('Rate limit approaching', { endpoint: '/search' });

      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.context.service).toBe('api');
      expect(logEntry.context.endpoint).toBe('/search');
    });
  });

  describe('Log buffer', () => {
    it('should store recent logs in buffer', () => {
      logger.info('Message 1');
      logger.warn('Message 2');
      logger.error('Message 3');

      const recent = logger.getRecentLogs(10);
      expect(recent).toHaveLength(3);
      expect(recent[0].message).toBe('Message 1');
      expect(recent[2].message).toBe('Message 3');
    });

    it('should limit buffer size to 1000 entries', () => {
      // Add more than 1000 logs
      for (let i = 0; i < 1100; i++) {
        logger.info(`Message ${i}`);
      }

      const recent = logger.getRecentLogs(2000);
      expect(recent.length).toBe(1000);
      
      // Should have kept the most recent ones
      expect(recent[999].message).toBe('Message 1099');
    });

    it('should clear buffer', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      
      expect(logger.getRecentLogs(10)).toHaveLength(2);
      
      logger.clearBuffer();
      
      expect(logger.getRecentLogs(10)).toHaveLength(0);
    });
  });

  describe('Timestamps', () => {
    it('should include ISO timestamp in log entries', () => {
      logger.info('Test message');

      const logEntry = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logEntry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});

