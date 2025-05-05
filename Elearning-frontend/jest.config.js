module.exports = {
  // The root directory where Jest should scan for tests
  roots: ['<rootDir>/src'],
  
  // Test environment - jsdom simulates a browser environment
  testEnvironment: 'jsdom',
  
  // File extensions Jest will look for
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Setup files that will run before each test
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js'
  ],
  
  // Mock static assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  
  // Verbose output
  verbose: true,
  
  // Print warning when tests take longer than 5 seconds
  testTimeout: 10000,
  
  // Number of workers for parallel testing
  // Setting to 1 can help with flaky or resource-intensive tests
  maxWorkers: 1,
  
  // Clear mocks between each test
  clearMocks: true,
  
  // Handle memory issues
  workerIdleMemoryLimit: '512MB',
  
  // Increase timeout for workers
  testTimeout: 30000,
};