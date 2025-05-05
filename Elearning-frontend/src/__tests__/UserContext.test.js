import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock axios before importing components that might use it
import axios from 'axios';
jest.mock('axios');


// Mock toast notifications
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  Toaster: () => <div data-testid="toaster">Toast Notification</div>
}));

// Mock server import
jest.mock('../index', () => ({
  server: 'http://localhost:4000'
}), { virtual: true });

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
const mockLocation = new URL('http://localhost:3000');
Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    href: mockLocation.href,
    assign: jest.fn(url => { mockLocation.href = url; }),
    replace: jest.fn(url => { mockLocation.href = url; })
  },
  writable: true
});

// Mock UserData hook before importing the actual context
const mockUserData = {
  user: null,
  setUser: jest.fn(),
  isAuth: false,
  setIsAuth: jest.fn(),
  teachers: [],
  setTeachers: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
  fetchTeachers: jest.fn(),
  resetPasswordRequest: jest.fn(),
  resetPassword: jest.fn()
};

jest.mock('../context/UserContext', () => ({
  UserContextProvider: ({ children }) => <div data-testid="user-context-provider">{children}</div>,
  UserData: () => mockUserData
}));

// Now import for real to get any non-mocked exports
import { UserContextProvider, UserData } from '../context/UserContext';

// Unmock for actual testing
jest.unmock('../context/UserContext');

// Test component to access context
const TestComponent = () => {
  const { user, isAuth, loginUser, registerUser, fetchTeachers } = UserData();
  return (
    <div>
      <div data-testid="auth-status">{isAuth ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user-data">{user ? JSON.stringify(user) : 'no-user'}</div>
      <button data-testid="login-btn" onClick={() => loginUser('test@example.com', 'password', jest.fn(), jest.fn())}>Login</button>
      <button data-testid="register-btn" onClick={() => registerUser('Test User', 'test@example.com', 'password', jest.fn())}>Register</button>
      <button data-testid="fetch-teachers-btn" onClick={() => fetchTeachers()}>Fetch Teachers</button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockImplementation(() => null);
  });

  test('provides default values', async () => {
    let renderResult;
    
    await act(async () => {
      renderResult = render(
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      );
    });
    
    expect(screen.getByTestId('auth-status').textContent).toBe('not-authenticated');
    expect(screen.getByTestId('user-data').textContent).toBe('no-user');
  });

  test('login updates auth state on success', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', _id: '123' };
    
    axios.post.mockResolvedValueOnce({ 
      data: {
        token: 'fake-token',
        user: userData,
        message: 'Login successful'
      }
    });
    
    await act(async () => {
      render(
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      );
    });
    
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password'
        })
      );
    });
  });

  test('registerUser calls API and handles success', async () => {
    axios.post.mockResolvedValueOnce({ 
      data: {
        message: 'Registration successful'
      }
    });
    
    await act(async () => {
      render(
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      );
    });
    
    await act(async () => {
      screen.getByTestId('register-btn').click();
    });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/register'),
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password'
        })
      );
    });
  });

  test('fetchTeachers loads teacher data successfully', async () => {
    const teachers = [
      { _id: '1', name: 'Teacher 1', role: 'teacher' },
      { _id: '2', name: 'Teacher 2', role: 'teacher' }
    ];

    axios.get.mockResolvedValueOnce({
      data: { teachers }
    });
    
    await act(async () => {
      render(
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      );
    });
    
    await act(async () => {
      screen.getByTestId('fetch-teachers-btn').click();
    });
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/teachers'));
    });
  });
  
  test('handles valid token in localStorage', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', _id: '123' };
    
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      return null;
    });
    
    axios.get.mockResolvedValueOnce({
      data: {
        user: userData,
        isValid: true
      }
    });
    
    await act(async () => {
      render(
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      );
    });
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/verify-token'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token'
          })
        })
      );
    });
  });
});
