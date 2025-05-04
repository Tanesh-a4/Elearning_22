import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '../models/user.js';
import { register, loginUser, verifyUser } from '../controllers/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../middlewares/sendMail.js', () => {
  return jest.fn().mockImplementation(() => Promise.resolve());
});

let mongoServer;
beforeAll(async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Authentication Controllers', () => {
  beforeEach(async () => {
    // Clean up user collection before each test
    await User.deleteMany({});
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  describe('register', () => {
    test('should register a new user and return activation token', async () => {
      process.env.Activation_Secret = 'test-secret';
      
      const reqMock = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await register(reqMock, resMock);
      
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          activationToken: expect.any(String)
        })
      );
    });
    
    test('should return error if user already exists', async () => {
      // Create a user first
      await User.create({
        name: 'Test User',
        email: 'existing@example.com',
        password: await bcrypt.hash('password123', 10)
      });
      
      const reqMock = {
        body: {
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123'
        }
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await register(reqMock, resMock);
      
      expect(resMock.status).toHaveBeenCalledWith(400);
    });
  });
  
  describe('loginUser', () => {
    test('should login user with valid credentials and return token', async () => {
      process.env.Jwt_Sec = 'test-secret';
      
      // Create a user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
      
      const reqMock = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      
      const resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await loginUser(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            name: 'Test User',
            email: 'test@example.com'
          })
        })
      );
    });
    
    test('should return error for invalid credentials', async () => {
      // Create a user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
      
      const reqMock = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };
      
      const resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await loginUser(reqMock, resMock);
      
      expect(resMock.status).toHaveBeenCalledWith(400);
    });
  });
});