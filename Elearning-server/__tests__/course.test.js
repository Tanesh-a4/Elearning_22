import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { getAllCourses, getSingleCourse, fetchLectures, getUserCourses, generateCourseReport } from '../controllers/course.js';
import { User } from '../models/user.js';
import { Courses } from '../models/Courses.js';
import { Lecture } from '../models/Lecture.js';
import { Progress } from '../models/Progress.js';

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

describe('Course Controllers', () => {
  let testUser, testCourse, testLecture;
  
  beforeEach(async () => {
    // Clean up collections
    await User.deleteMany({});
    await Courses.deleteMany({});
    await Lecture.deleteMany({});
    await Progress.deleteMany({});
    
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user'
    });
    
    // Create a test course
    testCourse = await Courses.create({
      title: 'Test Course',
      description: 'Test Description',
      category: 'Development',
      createdBy: 'Test Instructor',
      duration: 8,
      price: 499,
      image: 'test.jpg',
      owner: testUser._id
    });
    
    // Create a test lecture
    testLecture = await Lecture.create({
      title: 'Test Lecture',
      description: 'Test Lecture Description',
      video: 'test-video.mp4',
      course: testCourse._id
    });
    
    // Add course to user subscription
    testUser.subscription.push(testCourse._id);
    await testUser.save();
  });
  
  describe('getAllCourses', () => {
    test('should return all courses', async () => {
      const reqMock = {};
      const resMock = {
        json: jest.fn()
      };
      
      await getAllCourses(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          courses: expect.arrayContaining([
            expect.objectContaining({
              title: 'Test Course'
            })
          ])
        })
      );
    });
  });
  
  describe('getSingleCourse', () => {
    test('should return a specific course by ID', async () => {
      const reqMock = {
        params: { id: testCourse._id.toString() }
      };
      
      const resMock = {
        json: jest.fn()
      };
      
      await getSingleCourse(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          course: expect.objectContaining({
            title: 'Test Course',
            description: 'Test Description'
          })
        })
      );
    });
  });
  
  describe('fetchLectures', () => {
    test('should return lectures for a course when user has access', async () => {
      const reqMock = {
        params: { id: testCourse._id.toString() },
        user: {
          _id: testUser._id,
          role: 'user',
          subscription: [testCourse._id]
        }
      };
      
      const resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await fetchLectures(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          lectures: expect.arrayContaining([
            expect.objectContaining({
              title: 'Test Lecture'
            })
          ])
        })
      );
    });
    
    test('should deny access if user is not subscribed to the course', async () => {
      // Create a new user without a subscription
      const nonSubscribedUser = await User.create({
        name: 'Non Subscriber',
        email: 'nonsubscriber@example.com',
        password: 'hashedpassword',
        role: 'user'
      });
      
      const reqMock = {
        params: { id: testCourse._id.toString() },
        user: {
          _id: nonSubscribedUser._id,
          role: 'user',
          subscription: []
        }
      };
      
      const resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await fetchLectures(reqMock, resMock);
      
      expect(resMock.status).toHaveBeenCalledWith(400);
    });
    
    test('should allow access to admin users regardless of subscription', async () => {
      // Create an admin user
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedpassword',
        role: 'admin'
      });
      
      const reqMock = {
        params: { id: testCourse._id.toString() },
        user: {
          _id: adminUser._id,
          role: 'admin',
          subscription: []
        }
      };
      
      const resMock = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      
      await fetchLectures(reqMock, resMock);
      
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          lectures: expect.arrayContaining([
            expect.objectContaining({
              title: 'Test Lecture'
            })
          ])
        })
      );
    });
  });
});