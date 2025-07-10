import cors from 'cors';
import { corsMiddleware } from '../cors';

jest.mock('cors', () => {
  return jest.fn(() => 'mocked-cors-middleware');
});

describe('CORS Middleware', () => {
  const mockCors = cors as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.FRONTEND_URL;
  });

  it('should configure CORS with default options', () => {
    // Re-import to trigger new configuration with default options
    jest.isolateModules(() => {
      require('../cors');
    });

    expect(mockCors).toHaveBeenCalledWith({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400
    });
  });

  it('should use FRONTEND_URL from environment when available', () => {
    process.env.FRONTEND_URL = 'http://example.com';
    
    // Re-import to trigger new configuration
    jest.isolateModules(() => {
      require('../cors');
    });

    expect(mockCors).toHaveBeenCalledWith(expect.objectContaining({
      origin: 'http://example.com'
    }));
  });

  it('should export configured middleware', () => {
    expect(corsMiddleware).toBe('mocked-cors-middleware');
  });
}); 