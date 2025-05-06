import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios before importing components that use it
jest.mock('axios');

// Mock server import that might be used in CourseContext
jest.mock('../index', () => ({
  server: 'http://localhost:4000'
}), { virtual: true });

// Now import the components
import { CourseContextProvider, CourseData } from '../context/CourseContext';

describe('CourseContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const { courses, fetchCourses, course, fetchCourse } = CourseData();

    React.useEffect(() => {
      fetchCourses();
    }, [fetchCourses]);

    return (
      <div>
        <div data-testid="courses-count">{courses ? courses.length : 0}</div>
        <div data-testid="course-title">{course && course.title ? course.title : 'No course selected'}</div>
        <button data-testid="fetch-course" onClick={() => fetchCourse('123')}>Fetch Course</button>
      </div>
    );
  };

  test('fetchCourses loads courses successfully', async () => {
    const mockCourses = [
      { _id: '1', title: 'Course 1', description: 'Description 1' },
      { _id: '2', title: 'Course 2', description: 'Description 2' }
    ];
  
    axios.get.mockResolvedValueOnce({
      data: { courses: mockCourses }
    });
  
    render(
      <CourseContextProvider>
        <TestComponent />
      </CourseContextProvider>
    );
  
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/course/all'));
      expect(screen.getByTestId('courses-count').textContent).toBe('2');
    });
  });
  
  // test('fetchCourse loads a single course successfully', async () => {
  //   const mockCourse = { _id: '123', title: 'Test Course', description: 'Test Description' };
  
  //   axios.get.mockResolvedValueOnce({
  //     data: { course: mockCourse }
  //   });
  
  //   render(
  //     <CourseContextProvider>
  //       <TestComponent />
  //     </CourseContextProvider>
  //   );
  
  //   await act(async () => {
  //     screen.getByTestId('fetch-course').click();
  //   });
  
  //   await waitFor(() => {
  //     expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/course/123'));
  //     expect(screen.getByTestId('course-title').textContent).toBe('Test Course');
  //   });
  // });
  
  // Testing error handling
  test('fetchCourse handles errors gracefully', async () => {
    // Mock an error response
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    
    console.log = jest.fn(); // Mock console.log to test error handling
    
    render(
      <CourseContextProvider>
        <TestComponent />
      </CourseContextProvider>
    );
  
    await act(async () => {
      screen.getByTestId('fetch-course').click();
    });
  
    await waitFor(() => {
      expect(console.log).toHaveBeenCalled();
      expect(screen.getByTestId('course-title').textContent).toBe('No course selected');
    });
  });
});
