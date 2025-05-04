import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock dependencies before importing the component
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate
}));

jest.mock('../context/UserContext', () => ({
  UserData: jest.fn()
}));

jest.mock('../context/CourseContext', () => ({
  CourseData: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Mock axios to prevent actual API calls
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} }))
}));

// Now import the component
import CourseCard from '../components/coursecard/CourseCard';

describe('CourseCard Component', () => {
  const mockCourse = {
    _id: '123',
    title: 'React Fundamentals',
    description: 'Learn React basics',
    price: 299,
    createdBy: 'John Doe',
    category: 'Web Development',
    duration: '8',
    image: 'course-image.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    require('../context/UserContext').UserData.mockReturnValue({
      user: { _id: 'user123', subscription: [] },
      isAuth: true,
      checkIsPreviouslyPaid: jest.fn().mockResolvedValue(false)
    });
    
    require('../context/CourseContext').CourseData.mockReturnValue({
      fetchCourses: jest.fn(),
      enrollInCourse: jest.fn().mockResolvedValue({ success: true })
    });
  });

  test('renders course details correctly', () => {
    render(<CourseCard course={mockCourse} />);
    
    // Test for title - this should be visible
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    
    // The description might not be directly visible in the UI
    // Let's test for other elements we know are in the component
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('weeks')).toBeInTheDocument();
    expect(screen.getByText('299')).toBeInTheDocument();
  });

  test('shows "View Details" button', () => {
    render(<CourseCard course={mockCourse} />);
    
    const viewButton = screen.getByText('View Details');
    expect(viewButton).toBeInTheDocument();
    
    fireEvent.click(viewButton);
    expect(mockNavigate).toHaveBeenCalledWith(`/course/${mockCourse._id}`);
  });
  
  test('shows "Get Started" button when user is authenticated', () => {
    render(<CourseCard course={mockCourse} />);
    
    const getStartedButton = screen.getByText('Get Started');
    expect(getStartedButton).toBeInTheDocument();
  });

  test('navigates to login when user is not authenticated', () => {
    require('../context/UserContext').UserData.mockReturnValue({
      user: null,
      isAuth: false
    });
    
    render(<CourseCard course={mockCourse} />);
    
    const signInButton = screen.getByText('Get Started');
    expect(signInButton).toBeInTheDocument();
    
    fireEvent.click(signInButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});