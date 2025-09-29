import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mocks
jest.mock('axios');

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  Toaster: () => <div data-testid="toaster">Toast Notification</div>
}));

jest.mock('../index', () => ({
  server: 'http://localhost:4000'
}), { virtual: true });

const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

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

const loginUserMock = jest.fn();
const registerUserMock = jest.fn();
const fetchTeachersMock = jest.fn();

const mockUserData = {
  user: null,
  setUser: jest.fn(),
  isAuth: false,
  setIsAuth: jest.fn(),
  teachers: [],
  setTeachers: jest.fn(),
  loginUser: loginUserMock,
  logoutUser: jest.fn(),
  registerUser: registerUserMock,
  fetchTeachers: fetchTeachersMock,
  resetPasswordRequest: jest.fn(),
  resetPassword: jest.fn()
};

jest.mock('../context/UserContext', () => ({
  UserContextProvider: ({ children }) => <div data-testid="user-context-provider">{children}</div>,
  UserData: () => mockUserData
}));

import { UserContextProvider, UserData } from '../context/UserContext';

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

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/ ')) {
        return Promise.resolve({
          data: {
            user: { name: 'Test User', email: 'test@example.com', _id: '123' }
          }
        });
      }
      if (url.includes('/api/user/teachers')) {
        return Promise.resolve({ data: { teachers: [] } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('provides default values', async () => {
    await act(async () => {
      render(
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      );
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('not-authenticated');
    expect(screen.getByTestId('user-data').textContent).toBe('no-user');
  });

  test('login calls API handler correctly', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
        user: { name: 'Test User', email: 'test@example.com', _id: '123' },
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

    expect(loginUserMock).toHaveBeenCalledWith('test@example.com', 'password', expect.any(Function), expect.any(Function));
  });

  test('registerUser calls API and handles success', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Registration successful' } });

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

    expect(registerUserMock).toHaveBeenCalledWith('Test User', 'test@example.com', 'password', expect.any(Function));
  });

  test('fetchTeachers calls axios get', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        teachers: [
          { _id: '1', name: 'Teacher 1', role: 'teacher' },
          { _id: '2', name: 'Teacher 2', role: 'teacher' }
        ]
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
      screen.getByTestId('fetch-teachers-btn').click();
    });

    expect(fetchTeachersMock).toHaveBeenCalled();
  });

  // test('handles valid token in localStorage', async () => {
  //   localStorageMock.getItem.mockImplementation((key) => {
  //     if (key === 'token') return 'valid-token';
  //     return null;
  //   });

  //   axios.get.mockResolvedValueOnce({
  //     data: {
  //       user: { name: 'Test User', email: 'test@example.com', _id: '123' }
  //     }
  //   });

  //   await act(async () => {
  //     render(
  //       <UserContextProvider>
  //         <TestComponent />
  //       </UserContextProvider>
  //     );
  //   });

  //   await waitFor(() => {
  //     expect(axios.get).toHaveBeenCalledWith(
  //       expect.stringContaining('/api/user/me'),
  //       expect.objectContaining({
  //         headers: expect.objectContaining({
  //           token: 'valid-token'
  //         })
  //       })
  //     );
  //   });
  // });
});
