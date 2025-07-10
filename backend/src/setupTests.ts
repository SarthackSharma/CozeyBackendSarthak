// This file is run before Jest runs your tests
import '@testing-library/jest-dom';

// Extend expect matchers
expect.extend({
  toHaveBeenCalledExactlyOnceWith(received: jest.Mock, ...args: any[]) {
    const pass = received.mock.calls.length === 1 && 
                 JSON.stringify(received.mock.calls[0]) === JSON.stringify(args);
    return {
      pass,
      message: () => pass
        ? `Expected mock not to have been called exactly once with ${JSON.stringify(args)}`
        : `Expected mock to have been called exactly once with ${JSON.stringify(args)}`
    };
  }
}); 