import React, { useEffect, useState } from "react";
import "./CourseStudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../index";
import { FaBook, FaClock, FaUser, FaCalendarAlt, FaPlayCircle, FaCheck } from "react-icons/fa";
import Loading from "../../components/loading/Loading";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      await fetchCourse(params.id);
      setLoading(false);
    };
    
    loadCourse();
  }, [params.id, fetchCourse]);

  // Conditional Access Logic
  useEffect(() => {
    if (user) {
      const isAdmin = user.role === "admin";
      const isTeacher = user.role === "teacher";
      const hasSubscription = user.subscription?.includes(params.id);

      if (!isAdmin && !isTeacher && !hasSubscription) {
        navigate("/");
      }
    } else {
      navigate("/login"); // Redirect unauthenticated users to login
    }
  }, [user, params.id, navigate]);

  // Mock data for a better UI demonstration
  const mockProgress = 35; // percentage
  const mockModules = [
    { id: 1, title: "Introduction to Course", lectures: 3, complete: true },
    { id: 2, title: "Core Concepts", lectures: 5, complete: false },
    { id: 3, title: "Advanced Techniques", lectures: 4, complete: false },
    { id: 4, title: "Practical Applications", lectures: 6, complete: false },
    { id: 5, title: "Final Project & Conclusion", lectures: 3, complete: false }
  ];

  if (loading) return <Loading />;

  if (!course) {
    return (
      <div className="cs-error-container">
        <div className="cs-error-content">
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/courses')} className="cs-btn">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-container">
      <div className="cs-header">
        <div className="cs-header-content">
          <h1 className="cs-title">{course.title}</h1>
          <div className="cs-meta">
            <div className="cs-meta-item">
              <FaUser className="cs-meta-icon" />
              <span>Instructor: {course.createdBy}</span>
            </div>
            <div className="cs-meta-item">
              <FaClock className="cs-meta-icon" />
              <span>Duration: {course.duration} weeks</span>
            </div>
            <div className="cs-meta-item">
              <FaCalendarAlt className="cs-meta-icon" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cs-dashboard">
        <div className="cs-sidebar">
          <div className="cs-progress-container">
            <div className="cs-progress-header">
              <h3>Your Progress</h3>
              <span className="cs-progress-percentage">{mockProgress}%</span>
            </div>
            <div className="cs-progress-bar">
              <div 
                className="cs-progress-fill" 
                style={{ width: `${mockProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="cs-image-container">
            <img 
              src={`${server}/${course.image}`} 
              alt={course.title}
              className="cs-course-image" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Course+Image";
              }}
            />
          </div>
          <div className="cs-actions">
  <Link to={`/lectures/${course._id}`} className="cs-primary-btn">
    <FaPlayCircle className="cs-btn-icon" />
    {user?.role === "admin" || (user?.role === "teacher" && course?.owner === user?._id) 
      ? "Add Lectures" 
      : "Continue Learning"}
  </Link>
</div>
        </div>

        <div className="cs-main-content">
          <div className="cs-overview">
            <h2 className="cs-section-title">Course Overview</h2>
            <p className="cs-description">{course.description}</p>
          </div>

          <div className="cs-modules">
            <h2 className="cs-section-title">Course Content</h2>
            <div className="cs-module-list">
              {mockModules.map((module) => (
                <div key={module.id} className={`cs-module-item ${module.complete ? 'cs-completed' : ''}`}>
                  <div className="cs-module-header">
                    <div className="cs-module-title">
                      {module.complete ? (
                        <FaCheck className="cs-icon-complete" />
                      ) : (
                        <FaBook className="cs-icon-module" />
                      )}
                      <h3>{module.title}</h3>
                    </div>
                    <div className="cs-module-meta">
                      <span>{module.lectures} lectures</span>
                      <span className="cs-module-status cs-available">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="cs-footer">
        <Link to={`/lectures/${course._id}`} className="cs-footer-btn">
          Go to Lectures
        </Link>
      </div>
    </div>
  );
};

export default CourseStudy;
