// src/__mocks__/styleMock.js
module.exports = {};

// src/__mocks__/fileMock.js
module.exports = 'test-file-stub';

// src/__mocks__/axios.js
const axiosMock = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn().mockReturnThis(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  defaults: {
    baseURL: '',
    headers: {
      common: {}
    }
  }
};

module.exports = axiosMock;