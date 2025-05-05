const express = jest.createMockFromModule('express');

// Create a mock router with all the HTTP methods
const mockRouter = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  use: jest.fn(),
  route: jest.fn().mockReturnThis()
};

// Mock the Router function to return our mockRouter
express.Router = jest.fn(() => mockRouter);

module.exports = express;