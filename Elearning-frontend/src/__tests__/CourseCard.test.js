import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

import CourseCard from '../components/coursecard/CourseCard';

const mockNavigate = jest.fn();

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

jest.mock('../context/UserContext', () => ({
  UserData: jest.fn(),
}));

jest.mock('../context/CourseContext', () => ({
  CourseData: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('CourseCard Component', () => {
  const mockCourse = {
    _id: '123',
    title: 'React Fundamentals',
    description: 'Learn React basics',
    price: 299,
    createdBy: 'John Doe',
    category: 'Web Development',
    duration: '8',
    image: 'course-image.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    axios.get.mockImplementation((url) => {
      if (url.includes('/me')) {
        return Promise.resolve({ data: { user: null } });
      }
      if (url.includes('/teachers')) {
        return Promise.resolve({ data: { teachers: [] } });
      }
      return Promise.resolve({ data: {} });
    });

    require('../context/UserContext').UserData.mockReturnValue({
      user: { _id: 'user123', subscription: [] },
      isAuth: true,
      checkIsPreviouslyPaid: jest.fn().mockResolvedValue(false),
    });

    require('../context/CourseContext').CourseData.mockReturnValue({
      fetchCourses: jest.fn(),
      enrollInCourse: jest.fn().mockResolvedValue({ success: true }),
    });
  });

  // test('renders course details correctly', () => {
  //   render(<CourseCard course={mockCourse} />);
  //   expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
  //   expect(screen.getByText('John Doe')).toBeInTheDocument();
  //   expect(screen.getByText('8')).toBeInTheDocument();
  //   expect(screen.getByText('weeks')).toBeInTheDocument();
  //   expect(screen.getByText('299')).toBeInTheDocument();
  // });

  test('shows "View Details" button and navigates on click', () => {
    render(<CourseCard course={mockCourse} />);
    const viewButton = screen.getByText('View Details');
    fireEvent.click(viewButton);
    expect(mockNavigate).toHaveBeenCalledWith(`/course/${mockCourse._id}`);
  });

  test('shows "Get Started" button when user is authenticated', () => {
    render(<CourseCard course={mockCourse} />);
    const getStartedBtn = screen.getByText('Get Started');
    expect(getStartedBtn).toBeInTheDocument();
    fireEvent.click(getStartedBtn);
    // optional: test successful enroll, depending on implementation
  });

  // test('navigates to login when user is not authenticated', () => {
  //   require('../context/UserContext').UserData.mockReturnValue({
  //     user: null,
  //     isAuth: false,
  //   });

  //   render(<CourseCard course={mockCourse} />);
  //   fireEvent.click(screen.getByText('Get Started'));
  //   expect(mockNavigate).toHaveBeenCalledWith('/login');
  // });
});
