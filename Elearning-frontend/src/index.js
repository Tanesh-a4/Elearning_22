import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {UserContextProvider}  from './context/UserContext';
import { CourseContextProvider } from './context/CourseContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export const server = "http://localhost:5000";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>  
   
   <UserContextProvider>
    <CourseContextProvider>
      <App />
    </CourseContextProvider>
   </UserContextProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
