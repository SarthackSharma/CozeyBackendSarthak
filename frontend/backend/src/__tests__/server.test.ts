import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import app from '../app';

jest.mock('fs');
jest.mock('path');
jest.mock('dotenv');
jest.mock('../app', () => ({
  listen: jest.fn((port, callback) => {
    callback();
    return { close: jest.fn() };
  })
}));

describe('Server', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  const mockPath = path as jest.Mocked<typeof path>;
  const mockConsole = jest.spyOn(console, 'log');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...process.env }; // Create a copy to avoid modifying the real env
    mockPath.join.mockImplementation((...args) => args.join('/'));
  });

  afterEach(() => {
    mockConsole.mockRestore();
  });

  it('should use default port when PORT env is not set', () => {
    delete process.env.PORT;
    
    // Re-import server to trigger new configuration
    jest.isolateModules(() => {
      require('../server');
    });

    expect(app.listen).toHaveBeenCalledWith(3001, expect.any(Function));
  });

  it('should use PORT from env when available', () => {
    process.env.PORT = '4000';
    
    // Re-import server to trigger new configuration
    jest.isolateModules(() => {
      require('../server');
    });

    expect(app.listen).toHaveBeenCalledWith('4000', expect.any(Function));
  });

  it('should check data files existence', () => {
    mockFs.existsSync
      .mockReturnValueOnce(true)  // products.json exists
      .mockReturnValueOnce(false); // orders.json doesn't exist

    // Re-import server to trigger new configuration
    jest.isolateModules(() => {
      require('../server');
    });

    expect(mockConsole).toHaveBeenCalledWith('Starting server with configuration:', expect.objectContaining({
      productsExists: true,
      ordersExists: false
    }));
  });

  it('should log server start message', () => {
    process.env.PORT = '3001';
    
    // Re-import server to trigger new configuration
    jest.isolateModules(() => {
      require('../server');
    });

    expect(mockConsole).toHaveBeenCalledWith('Server is running on port 3001');
  });

  it('should configure paths correctly', () => {
    const mockDirname = '/mock/path';
    jest.mock('path', () => ({
      ...jest.requireActual('path'),
      join: jest.fn(),
      dirname: jest.fn().mockReturnValue(mockDirname)
    }));

    // Re-import server to trigger new configuration
    jest.isolateModules(() => {
      require('../server');
    });

    expect(mockPath.join).toHaveBeenCalledWith(expect.any(String), '..', 'data');
    expect(mockPath.join).toHaveBeenCalledWith(expect.any(String), 'data', 'products.json');
    expect(mockPath.join).toHaveBeenCalledWith(expect.any(String), 'data', 'orders.json');
  });

  it('should load environment variables', () => {
    // Re-import server to trigger new configuration
    jest.isolateModules(() => {
      require('../server');
    });

    expect(dotenv.config).toHaveBeenCalled();
  });
}); 