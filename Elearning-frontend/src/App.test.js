import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock necessary modules and components
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ path }) => <div data-testid={`route-${path}`}></div>
}));

// Mock context providers
jest.mock('./context/UserContext', () => ({
  UserContextProvider: ({ children }) => <div data-testid="user-context">{children}</div>
}));

jest.mock('./context/CourseContext', () => ({
  CourseContextProvider: ({ children }) => <div data-testid="course-context">{children}</div>
}));

// Mock components
jest.mock('./components/header/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./components/footer/Footer', () => () => <div data-testid="footer">Footer</div>);

// Mock document.getElementById to prevent errors
document.getElementById = jest.fn(() => document.createElement('div'));

// Mock index.js createRoot
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Mock index.js server
jest.mock('./index', () => ({
  server: 'http://localhost:4000'
}), { virtual: true });

// Now import App after all mocks are in place
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    
    // Check if the main wrappers are rendered
    expect(getByTestId('user-context')).toBeInTheDocument();
    expect(getByTestId('course-context')).toBeInTheDocument();
    expect(getByTestId('browser-router')).toBeInTheDocument();
  });
});
