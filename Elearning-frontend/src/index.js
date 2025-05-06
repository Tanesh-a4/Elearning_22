import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserContextProvider } from './context/UserContext';
import { CourseContextProvider } from './context/CourseContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export const server = "http://localhost:5000";

function renderApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <UserContextProvider>
          <CourseContextProvider>
            <App />
          </CourseContextProvider>
        </UserContextProvider>
      </React.StrictMode>
    );
  }
}

if (process.env.NODE_ENV !== 'test') {
  renderApp();
}

// reportWebVitals should still run even during tests
reportWebVitals();

export { renderApp };
