import React from 'react';
import App from './App';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserContextProvider } from './context/UserContext';
import { CourseContextProvider } from './context/CourseContext';
import axios from 'axios';

// Mock Axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { courses: [] } })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

beforeEach(() => {
  axios.get.mockResolvedValue({ data: { courses: [] } });
  axios.post.mockResolvedValue({ data: {} });
  axios.put.mockResolvedValue({ data: {} });
  axios.delete.mockResolvedValue({ data: {} });
});


// Mock Router and Components
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ path, element }) => <div data-testid={`route-${path}`}>{element}</div>
}));

jest.mock('./components/header/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./components/footer/Footer', () => () => <div data-testid="footer">Footer</div>);

jest.mock('./index', () => ({
  server: 'http://localhost:4000'
}), { virtual: true });

describe('App Component', () => {
  test('renders without crashing', () => {
    const mockUserContextValue = {
      isAuth: false,
      user: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    };})

    const { getByTestId } = render(
      <UserContextProvider>
        <CourseContextProvider>
          <App />
        </CourseContextProvider>
      </UserContextProvider>
    );
  // test('basic sanity test - always passes', () => {
  //   const { getByText } = render(<div>Hello World</div>);
  //   expect(getByText('Hello World')).toBeInTheDocument();
  // });
});
