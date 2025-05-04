import { errorHandler } from '../middlewares/TryCatch.js';

describe('Error Handling Middleware', () => {
  test('should handle errors and format response properly', () => {
    const err = new Error('Test error');
    err.statusCode = 400;
    
    const reqMock = {};
    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const nextMock = jest.fn();
    
    // Set non-production environment for testing
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    
    errorHandler(err, reqMock, resMock, nextMock);
    
    // Restore environment
    process.env.NODE_ENV = originalNodeEnv;
    
    expect(resMock.status).toHaveBeenCalledWith(400);
    expect(resMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Test error',
        stack: expect.any(String)
      })
    );
  });
  
  test('should use default status code 500 if not specified', () => {
    const err = new Error('Server error');
    
    const reqMock = {};
    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const nextMock = jest.fn();
    
    errorHandler(err, reqMock, resMock, nextMock);
    
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Server error'
      })
    );
  });
});