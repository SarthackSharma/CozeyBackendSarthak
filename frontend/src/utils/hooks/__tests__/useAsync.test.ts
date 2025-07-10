import { renderHook, act } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAsync());
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful async operation', async () => {
    const mockData = 'test data';
    const mockAsync = jest.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useAsync<string>());
    
    expect(result.current.loading).toBe(false);
    
    await act(async () => {
      await result.current.execute(mockAsync);
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle async error', async () => {
    const mockError = new Error('Test error');
    const mockAsync = jest.fn().mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useAsync<string>());
    
    await act(async () => {
      try {
        await result.current.execute(mockAsync);
      } catch (error) {
        // Error is expected
      }
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
  });

  it('should handle loading state', async () => {
    const mockAsync = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('data'), 100)));
    
    const { result } = renderHook(() => useAsync<string>());
    
    let promise: Promise<any>;
    act(() => {
      promise = result.current.execute(mockAsync);
    });
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    await act(async () => {
      await promise;
    });
    
    expect(result.current.loading).toBe(false);
  });

  it('should handle reset', async () => {
    const mockData = 'test data';
    const mockAsync = jest.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useAsync<string>());
    
    await act(async () => {
      await result.current.execute(mockAsync);
    });
    
    expect(result.current.data).toBe(mockData);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle multiple sequential executions', async () => {
    const mockAsync1 = jest.fn().mockResolvedValue('data 1');
    const mockAsync2 = jest.fn().mockResolvedValue('data 2');
    
    const { result } = renderHook(() => useAsync<string>());
    
    await act(async () => {
      await result.current.execute(mockAsync1);
      expect(result.current.data).toBe('data 1');
      
      await result.current.execute(mockAsync2);
      expect(result.current.data).toBe('data 2');
    });
  });

  it('should handle reset during loading state', async () => {
    const mockAsync = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('test data'), 100)));
    
    const { result } = renderHook(() => useAsync<string>());
    
    let promise: Promise<any>;
    act(() => {
      promise = result.current.execute(mockAsync);
    });
    
    expect(result.current.loading).toBe(true);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    await act(async () => {
      await promise;
    });
    
    // State should remain reset even after promise resolves
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
}); 