import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiClient, handleError, handleResponse } from '../axiosConfig';

describe('Axios Configuration', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(apiClient);
    localStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
    localStorage.clear();
  });

  describe('apiClient', () => {
    it('should have correct base configuration', () => {
      expect(apiClient.defaults.baseURL).toBe(process.env.REACT_APP_API_URL || 'http://localhost:3000');
      expect(apiClient.defaults.headers.common['Content-Type']).toBe('application/json');
      expect(apiClient.defaults.timeout).toBe(10000);
    });

    it('should handle successful GET request', async () => {
      const mockData = { data: 'test' };
      mockAxios.onGet('/test').reply(200, mockData);

      const response = await apiClient.get('/test');
      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('should handle successful POST request', async () => {
      const mockData = { data: 'test' };
      const postData = { input: 'test' };
      mockAxios.onPost('/test', postData).reply(201, mockData);

      const response = await apiClient.post('/test', postData);
      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(201);
    });

    it('should handle successful PUT request', async () => {
      const mockData = { data: 'test' };
      const putData = { input: 'test' };
      mockAxios.onPut('/test', putData).reply(200, mockData);

      const response = await apiClient.put('/test', putData);
      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('should handle successful DELETE request', async () => {
      mockAxios.onDelete('/test').reply(204);

      const response = await apiClient.delete('/test');
      expect(response.status).toBe(204);
    });
  });

  describe('handleResponse', () => {
    it('should return response data for successful request', () => {
      const mockResponse: AxiosResponse = {
        data: { result: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: {} as any
        } as InternalAxiosRequestConfig
      };

      const result = handleResponse(mockResponse);
      expect(result).toEqual({ result: 'success' });
    });

    it('should handle empty response data', () => {
      const mockResponse: AxiosResponse = {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {
          headers: {} as any
        } as InternalAxiosRequestConfig
      };

      const result = handleResponse(mockResponse);
      expect(result).toBeNull();
    });
  });

  describe('handleError', () => {
    it('should handle network error', () => {
      const error = new Error('Network Error');
      Object.assign(error, { isAxiosError: true, response: undefined });

      expect(() => handleError(error)).toThrow('Network error occurred. Please check your connection.');
    });

    it('should handle timeout error', () => {
      const error = new Error('timeout of 10000ms exceeded');
      Object.assign(error, { isAxiosError: true, code: 'ECONNABORTED', response: undefined });

      expect(() => handleError(error)).toThrow('Request timed out. Please try again.');
    });

    it('should handle server error with error message', () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          data: { message: 'Internal server error' },
          status: 500
        }
      });

      expect(() => handleError(error)).toThrow('Internal server error');
    });

    it('should handle server error without error message', () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          status: 500,
          data: {}
        }
      });

      expect(() => handleError(error)).toThrow('An unexpected error occurred');
    });

    it('should handle client error with validation messages', () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          data: { errors: ['Invalid input', 'Required field missing'] },
          status: 400
        }
      });

      expect(() => handleError(error)).toThrow('Invalid input, Required field missing');
    });

    it('should handle unauthorized error', () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: 'Unauthorized access' }
        }
      });

      expect(() => handleError(error)).toThrow('Unauthorized access');
    });

    it('should handle forbidden error', () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          status: 403,
          data: { message: 'Forbidden access' }
        }
      });

      expect(() => handleError(error)).toThrow('Forbidden access');
    });

    it('should handle not found error', () => {
      const error = new Error();
      Object.assign(error, {
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: 'Resource not found' }
        }
      });

      expect(() => handleError(error)).toThrow('Resource not found');
    });

    it('should handle unknown error', () => {
      const error = new Error('Unknown error');

      expect(() => handleError(error)).toThrow('An unexpected error occurred');
    });
  });

  describe('Request Interceptors', () => {
    it('should add authorization header when token exists', async () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const mockData = { data: 'test' };
      mockAxios.onGet('/test').reply(config => {
        expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
        return [200, mockData];
      });

      await apiClient.get('/test');
    });

    it('should not add authorization header when token does not exist', async () => {
      const mockData = { data: 'test' };
      mockAxios.onGet('/test').reply(config => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, mockData];
      });

      await apiClient.get('/test');
    });
  });
}); 