import React from 'react';
import App from './App';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';


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
    const { getByTestId } = render(<App />);
    expect(getByTestId('browser-router')).toBeInTheDocument();
    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });
});
