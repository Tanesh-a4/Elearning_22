import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock dependencies before importing the component
jest.mock('axios');

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  Toaster: () => null
}));

// Mock server import that might be used in UserContext
jest.mock('../index', () => ({
  server: 'http://localhost:4000'
}), { virtual: true });

// Now import the component
import { UserContextProvider, UserData } from '../context/UserContext';
import axios from 'axios';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test component to access context
const TestComponent = () => {
  const { user, isAuth, loginUser, registerUser } = UserData();
  return (
    <div>
      <div data-testid="auth-status">{isAuth ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user-data">{JSON.stringify(user)}</div>
      <button data-testid="login-btn" onClick={() => loginUser('test@example.com', 'password', jest.fn(), jest.fn())}>Login</button>
      <button data-testid="register-btn" onClick={() => registerUser('Test User', 'test@example.com', 'password', jest.fn())}>Register</button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides default values', () => {
    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );
    
    expect(screen.getByTestId('auth-status').textContent).toBe('not-authenticated');
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
    
    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );
    
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-token');
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
    
    const TestTeacherComponent = () => {
      const { teachers, fetchTeachers } = UserData();
      
      React.useEffect(() => {
        fetchTeachers();
      }, [fetchTeachers]);
      
      return (
        <div data-testid="teachers-count">{teachers ? teachers.length : 0}</div>
      );
    };
    
    render(
      <UserContextProvider>
        <TestTeacherComponent />
      </UserContextProvider>
    );
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});