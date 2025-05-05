import '@testing-library/jest-dom';

// Add TextEncoder/TextDecoder polyfill for node environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
}

// Mock the server variable that would normally be imported from index.js
jest.mock('./index', () => ({
  server: 'http://localhost:4000'
}), { virtual: true });

// Mock document.getElementById to prevent errors in index.js
document.getElementById = jest.fn(() => document.createElement('div'));

// Mock window.matchMedia - used by some UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
