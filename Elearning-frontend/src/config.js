// API configuration for different environments
const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://elearning-22.onrender.com'
  },
  test: {
    API_URL: 'http://localhost:4000'
  }
};

const currentEnv = process.env.NODE_ENV || 'development';
export const server = config[currentEnv]?.API_URL || config.development.API_URL;