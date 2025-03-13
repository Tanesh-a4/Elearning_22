import React, { useEffect } from "react";
import "./Courseshome.css";
import { CourseData } from "../../context/CourseContext";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { MdOutlineTrendingUp, MdArrowForward, MdPeople, MdAccessTime, MdStar } from "react-icons/md";
import { server } from "../../index";

const CoursesHome = () => {
  const { courses, fetchCourses } = CourseData();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Fetch courses on component mount
  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses.length, fetchCourses]);

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Level badge color
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "#4CAF50";
      case "intermediate": return "#FF9800";
      case "advanced": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  return (
    <div ref={ref} className="ch-section-wrapper">
      <div className={`ch-section-container ${inView ? 'ch-animate-in' : ''}`}>
        <div className="ch-section-header">
          <div className="ch-header-content">
            <div className="ch-icon-container">
              <MdOutlineTrendingUp className="ch-header-icon" />
            </div>
            <h2 className="ch-section-title">Featured Courses</h2>
          </div>
          <p className="ch-section-subtitle">
            Start your learning journey with our most popular courses
          </p>
        </div>
        
        <div className="ch-courses-grid">
          {courses && courses.length > 0 ? (
            courses.slice(0, 3).map((course, index) => (
              <div 
                key={course._id} 
                className={`ch-course-card ${inView ? 'ch-animate-card' : ''}`}
                style={{ animationDelay: `${0.1 + index * 0.15}s` }}
              >
                <div className="ch-course-image">
                  {course.image ? (
                    <img 
                      src={`${server}/${course.image}`}
                      alt={course.title} 
                      className="ch-course-thumbnail"
                    />
                  ) : (
                    <div className="ch-image-placeholder">
                      <span>{course.title ? course.title.charAt(0) : "C"}</span>
                    </div>
                  )}
                  <div className="ch-course-level" style={{backgroundColor: getLevelColor(course.level)}}>
                    {course.level || "All Levels"}
                  </div>
                </div>
                
                <div className="ch-course-content">
                  <div className="ch-course-category">{course.category || "Development"}</div>
                  
                  <h3 className="ch-course-title">
                    <Link to={`/courses/${course._id}`}>{course.title}</Link>
                  </h3>
                  
                  <p className="ch-course-description">
                    {truncateText(course.description, 100)}
                  </p>
                  
                  <div className="ch-course-meta">
                    <div className="ch-meta-item">
                      <MdPeople className="ch-meta-icon" />
                      <span>{course.enrolled || 0} students</span>
                    </div>
                    
                    <div className="ch-meta-item">
                      <MdAccessTime className="ch-meta-icon" />
                      <span>{course.duration || "8 hours"}</span>
                    </div>
                    
                    <div className="ch-meta-item ch-rating">
                      <MdStar className="ch-meta-icon ch-star" />
                      <span>{course.rating || "4.8"}</span>
                    </div>
                  </div>
                  
                  <div className="ch-course-footer">
                    <div className="ch-instructor">
                      <div className="ch-instructor-avatar">
                        {course.createdBy ? course.createdBy.charAt(0) : "I"}
                      </div>
                      <span className="ch-instructor-name">
                        {course.createdBy || "Instructor Name"}
                      </span>
                    </div>
                    
                    <div className="ch-course-price">
                      {course.price ? (
                        <span>₹{course.price}</span>
                      ) : (
                        <span>₹3,999</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ch-loading-courses">
              <div className="ch-loading-spinner"></div>
              <p>Loading courses...</p>
            </div>
          )}
        </div>
        
        <div className="ch-action-row">
          <Link to="/courses" className="ch-explore-button">
            Explore All Courses
            <MdArrowForward className="ch-button-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesHome;
