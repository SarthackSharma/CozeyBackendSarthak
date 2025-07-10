import { Request, Response } from 'express';
import { AppError, errorHandler } from '../errorHandler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should handle AppError correctly', () => {
    const appError = new AppError(400, 'Bad Request');
    
    errorHandler(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Bad Request'
    });
  });

  it('should handle unknown errors with 500 status', () => {
    const unknownError = new Error('Unknown error');
    
    errorHandler(
      unknownError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error'
    });
  });

  describe('AppError', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError(404, 'Not Found');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.name).toBe('AppError');
    });

    it('should capture stack trace', () => {
      const error = new AppError(500, 'Server Error');
      expect(error.stack).toBeDefined();
    });
  });
}); 