import { isAuth, isTeacher, isAdmin } from '../middlewares/isAuth.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Middlewares', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  
  describe('isAuth', () => {
    test('should validate a valid token and set req.user', async () => {
      process.env.Jwt_Sec = 'test-secret';
      
      // Create a user
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      });
      
      // Create a token
      const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec);
      
      const reqMock = {
        headers: { token },
        user: null
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const nextMock = jest.fn();
      
      await isAuth(reqMock, resMock, nextMock);
      
      expect(reqMock.user).toBeDefined();
      expect(reqMock.user._id.toString()).toBe(user._id.toString());
      expect(nextMock).toHaveBeenCalled();
    });
    
    test('should return 401 if no token is provided', async () => {
      const reqMock = {
        headers: {}
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const nextMock = jest.fn();
      
      await isAuth(reqMock, resMock, nextMock);
      
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(nextMock).not.toHaveBeenCalled();
    });
    
    test('should return 401 if token is invalid', async () => {
      process.env.Jwt_Sec = 'test-secret';
      
      const reqMock = {
        headers: { token: 'invalid-token' }
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const nextMock = jest.fn();
      
      await isAuth(reqMock, resMock, nextMock);
      
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
  
  describe('isTeacher', () => {
    test('should allow access to teacher role', async () => {
      const reqMock = {
        user: { role: 'teacher' }
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const nextMock = jest.fn();
      
      await isTeacher(reqMock, resMock, nextMock);
      
      expect(nextMock).toHaveBeenCalled();
    });
    
    test('should deny access to non-teacher role', async () => {
      const reqMock = {
        user: { role: 'user' }
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const nextMock = jest.fn();
      
      await isTeacher(reqMock, resMock, nextMock);
      
      expect(resMock.status).toHaveBeenCalledWith(403);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
  
  describe('isAdmin', () => {
    test('should allow access to admin role', async () => {
      const reqMock = {
        user: { role: 'admin' }
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const nextMock = jest.fn();
      
      await isAdmin(reqMock, resMock, nextMock);
      
      expect(nextMock).toHaveBeenCalled();
    });
    
    test('should deny access to non-admin role', async () => {
      const reqMock = {
        user: { role: 'user' }
      };
      
      const resMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const nextMock = jest.fn();
      
      await isAdmin(reqMock, resMock, nextMock);
      
      expect(resMock.status).toHaveBeenCalledWith(403);
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});