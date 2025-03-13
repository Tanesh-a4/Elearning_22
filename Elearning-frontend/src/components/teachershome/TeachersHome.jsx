import React, { useEffect } from "react";
import { UserData } from "../../context/UserContext";
import "./TeachersHome.css";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const TeachersHome = () => {
  const { teachers, fetchTeachers } = UserData();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (teachers.length === 0) {
      fetchTeachers();
    }
  }, [teachers, fetchTeachers]);

  return (
    <div className="home-teachers-section" ref={ref}>
      <div className="home-teachers-container">
        <div className="home-teachers-header">
          <h2 className={`home-teachers-title ${inView ? 'home-animate-title' : ''}`}>
            Meet Our Expert Instructors
          </h2>
          <p className={`home-teachers-subtitle ${inView ? 'home-animate-subtitle' : ''}`}>
            Learn from industry professionals with years of experience
          </p>
        </div>
        
        <div className="home-teachers-grid">
          {teachers.length > 0 ? (
            teachers.slice(0, 3).map((teacher, index) => (
              <div 
                className={`home-teacher-card ${inView ? 'home-animate-card' : ''}`} 
                key={teacher._id}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="home-teacher-avatar">
                  <div className="home-teacher-avatar-placeholder">
                    {teacher.name.charAt(0)}
                  </div>
                </div>
                <div className="home-teacher-info">
                  <h3 className="home-teacher-name">{teacher.name}</h3>
                  <p className="home-teacher-role">{teacher.role || 'Instructor'}</p>
                  <div className="home-teacher-stats">
                    <div className="home-teacher-stat">
                      <span className="home-stat-value">4.9</span>
                      <span className="home-stat-label">Rating</span>
                    </div>
                    <div className="home-teacher-stat">
                      <span className="home-stat-value">{Math.floor(Math.random() * 20) + 5}</span>
                      <span className="home-stat-label">Courses</span>
                    </div>
                    <div className="home-teacher-stat">
                      <span className="home-stat-value">{Math.floor(Math.random() * 10000) + 1000}</span>
                      <span className="home-stat-label">Students</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="home-no-teachers">
              <div className="home-no-teachers-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <p>Our teachers are taking a break. Check back soon!</p>
            </div>
          )}
        </div>
        
        <div className={`home-view-all-container ${inView ? 'home-animate-button' : ''}`}>
          <Link to="/teachers" className="home-view-all-teachers">
            View All Instructors
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeachersHome;
