// Jest setup file - place this in your project root or src directory
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom'
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


// Mock canvas for HTML Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  fillText: jest.fn(),
  strokeText: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createPattern: jest.fn(() => ({})),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  bezierCurveTo: jest.fn(),
  quadraticCurveTo: jest.fn(),
  arc: jest.fn(),
  arcTo: jest.fn(),
  ellipse: jest.fn(),
  rect: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  clip: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock window.location
const mockLocation = new URL('http://localhost:3000');
Object.defineProperty(window, 'location', {
  value: {
    href: mockLocation.href,
    pathname: mockLocation.pathname,
    search: mockLocation.search,
    hash: mockLocation.hash,
    assign: jest.fn(url => { mockLocation.href = url; }),
    replace: jest.fn(url => { mockLocation.href = url; }),
    reload: jest.fn()
  },
  writable: true
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }
  
  observe(element) {
    this.elements.add(element);
    this.callback([{ isIntersecting: true, target: element }], this);
  }
  
  unobserve(element) {
    this.elements.delete(element);
  }
  
  disconnect() {
    this.elements.clear();
  }

  // Helper method for tests
  triggerIntersection(isIntersecting) {
    this.elements.forEach(element => {
      this.callback([{ isIntersecting, target: element }], this);
    });
  }
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }
  
  observe(element) {
    this.elements.add(element);
  }
  
  unobserve(element) {
    this.elements.delete(element);
  }
  
  disconnect() {
    this.elements.clear();
  }
}

window.ResizeObserver = MockResizeObserver;

// Suppress console errors/warnings in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Ignore React warnings about act(...) or specific errors you want to suppress
  if (
    args[0]?.includes?.('Warning: An update to') ||
    args[0]?.includes?.('inside a test was not wrapped in act') ||
    args[0]?.includes?.('Not implemented: HTMLCanvasElement.prototype.getContext')
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Ignore specific warnings
  if (
    args[0]?.includes?.('Warning: React.jsx:')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Mock any global modules used across multiple test files
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  Toaster: () => <div data-testid="toaster">Toast</div>
}));

// Add any global mock timers if needed
// jest.useFakeTimers();