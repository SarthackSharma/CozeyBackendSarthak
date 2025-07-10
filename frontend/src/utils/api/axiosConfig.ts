import axios, { AxiosResponse, AxiosError } from 'axios';

// Force the base URL to be explicit
const baseURL = 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
      fullURL: error.config?.baseURL + error.config?.url
    });
    return Promise.reject(handleError(error));
  }
);

export function handleResponse<T>(response: AxiosResponse<T>): T {
  return response.data;
}

export function handleError(error: Error | AxiosError): never {
  if (axios.isAxiosError(error)) {
    // Network error
    if (!error.response) {
      throw new Error('Network error occurred. Please check your connection and ensure the backend server is running.');
    }

    // Server error with response
    if (error.response) {
      const { status, data } = error.response;

      // Handle validation errors
      if (status === 400 && data.errors) {
        throw new Error(data.errors.join(', '));
      }

      // Handle specific status codes
      switch (status) {
        case 401:
          throw new Error('Unauthorized. Please log in again.');
        case 403:
          throw new Error('You do not have permission to access this resource.');
        case 404:
          throw new Error('The requested resource was not found.');
        case 500:
          throw new Error('Internal server error. Please try again later.');
        default:
          throw new Error(data.message || `Server error (${status}). Please try again.`);
      }
    }
  }

  // Unknown error
  throw new Error(`An unexpected error occurred: ${error.message}`);
} 