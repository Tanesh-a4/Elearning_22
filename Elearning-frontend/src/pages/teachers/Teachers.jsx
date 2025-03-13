import React, { useEffect, useState } from 'react';
import { UserData } from '../../context/UserContext';
import { FaLinkedin, FaGraduationCap, FaChalkboardTeacher, FaUserAlt, FaStar } from 'react-icons/fa';
import { MdEmail, MdSchool } from 'react-icons/md';
import "./Teacher.css";

const Teacher = () => {
  const { teachers, fetchTeachers } = UserData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      if (teachers.length === 0) {
        await fetchTeachers();
      }
      setIsLoading(false);
    };
    
    loadTeachers();
  }, [teachers, fetchTeachers]);

  // Get random expertise areas for demonstration
  const getRandomExpertise = () => {
    const areas = [
      'Web Development', 'Data Science', 'Mobile App Development', 
      'Machine Learning', 'UI/UX Design', 'Cloud Computing',
      'DevOps', 'Cybersecurity', 'Artificial Intelligence'
    ];
    const numAreas = Math.floor(Math.random() * 3) + 1; // 1-3 areas
    const selectedAreas = [];
    
    for (let i = 0; i < numAreas; i++) {
      const randomIndex = Math.floor(Math.random() * areas.length);
      if (!selectedAreas.includes(areas[randomIndex])) {
        selectedAreas.push(areas[randomIndex]);
      }
    }
    
    return selectedAreas;
  };

  return (
    <div className="teachers-page">
      <div className="teachers-hero">
        <div className="hero-content">
          <h1>Meet Our Expert Instructors</h1>
          <p>Learn from industry professionals with years of experience</p>
        </div>
      </div>
      
      <div className="teachers-container">
        <div className="teachers-header">
          <div className="header-content">
            <div className="section-icon">
              <FaChalkboardTeacher />
            </div>
            <div className="section-text">
              <h2>Our Teaching Faculty</h2>
              <p>Discover the talented professionals who will guide your learning journey</p>
            </div>
          </div>

          <div className="teachers-stats">
            <div className="stat-item">
              <span className="stat-number">{teachers.length}</span>
              <span className="stat-label">Instructors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12K+</span>
              <span className="stat-label">Students</span>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="teachers-loading">
            <div className="loading-spinner"></div>
            <p>Loading our amazing teachers...</p>
          </div>
        ) : (
          <div className="teachers-grid">
            {teachers.length > 0 ? (
              teachers.map((teacher) => {
                const expertise = getRandomExpertise();
                const randomRating = (Math.random() * (5 - 4.2) + 4.2).toFixed(1);
                
                return (
                  <div className="teacher-card" key={teacher._id}>
                    <div className="teacher-avatar">
                      <div className="avatar-placeholder">
                        {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="teacher-info">
                      <h3>{teacher.name}</h3>
                      
                      <div className="teacher-badge">
                        <FaGraduationCap />
                        <span>{teacher.role === 'teacher' ? 'Senior Instructor' : 'Instructor'}</span>
                      </div>
                      
                      <div className="teacher-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(randomRating) ? 'filled' : 'empty'} />
                          ))}
                        </div>
                        <span>{randomRating}</span>
                      </div>
                    </div>
                    
                    <div className="teacher-expertise">
                      <h4>Areas of Expertise</h4>
                      <div className="expertise-tags">
                        {expertise.map((area, index) => (
                          <span key={index} className="expertise-tag">{area}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="teacher-contact">
                      <a href={`mailto:${teacher.email}`} className="contact-link">
                        <MdEmail /> Contact
                      </a>
                      <a href={`/teachers/${teacher._id}/courses`} className="courses-link">
                        <MdSchool /> View Courses
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-teachers">
                <FaUserAlt className="no-data-icon" />
                <h3>No teachers found</h3>
                <p>Check back later for our growing list of expert instructors.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teacher;
