import { logger } from '../index';

describe('Logger', () => {
  const originalConsole = global.console;
  const mockConsole = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  };

  beforeEach(() => {
    global.console = { ...originalConsole, ...mockConsole };
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  describe('info', () => {
    it('should log info message with timestamp', () => {
      logger.info('test message');
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] INFO: test message$/)
      );
    });

    it('should include meta data when provided', () => {
      const meta = { user: 'test' };
      logger.info('test message', meta);
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] INFO: test message {"user":"test"}$/)
      );
    });
  });

  describe('warn', () => {
    it('should log warning message with timestamp', () => {
      logger.warn('test warning');
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] WARN: test warning$/)
      );
    });

    it('should include meta data when provided', () => {
      const meta = { source: 'test' };
      logger.warn('test warning', meta);
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] WARN: test warning {"source":"test"}$/)
      );
    });
  });

  describe('error', () => {
    it('should log error message with timestamp', () => {
      logger.error('test error');
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] ERROR: test error$/)
      );
    });

    it('should include error object when provided', () => {
      const error = new Error('test error');
      error.stack = 'test stack';
      logger.error('error occurred', error);
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringMatching(/ERROR: error occurred {"error":{"message":"test error","stack":"test stack","name":"Error"}}/)
      );
    });

    it('should include both error and meta data when provided', () => {
      const error = new Error('test error');
      const meta = { context: 'test' };
      logger.error('error occurred', error, meta);
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringMatching(/ERROR: error occurred {"context":"test","error":/)
      );
    });
  });

  describe('debug', () => {
    it('should log debug message in non-production environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.debug('test debug');
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] DEBUG: test debug$/)
      );

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should not log debug message in production environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logger.debug('test debug');
      expect(mockConsole.debug).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should include meta data when provided in non-production', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const meta = { debug: 'info' };
      logger.debug('test debug', meta);
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] DEBUG: test debug {"debug":"info"}$/)
      );

      process.env.NODE_ENV = originalNodeEnv;
    });
  });
}); 