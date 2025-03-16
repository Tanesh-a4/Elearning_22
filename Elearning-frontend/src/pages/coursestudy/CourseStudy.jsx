import React, { useEffect, useState } from "react";
import "./CourseStudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../index";
import { FaBook, FaClock, FaUser, FaCalendarAlt, FaPlayCircle, FaCheck } from "react-icons/fa";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlay, FaPlus, FaTrash, FaTimes, FaUpload, FaVideo } from "react-icons/fa";

const CourseStudy = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  console.log(course._id)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);
  const [lecture, setLecture] = useState([]);
  const [lecLoading, setLecLoading] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      await fetchCourse(params.id);
      setLoading(false);
    };
    
    loadCourse();
    fetchLectures();
    fetchProgress();
  }, [params.id, fetchCourse]);

  useEffect(() => {
    if (user) {
      const isAdmin = user.role === "admin";
      const isTeacher = user.role === "teacher";
      const hasSubscription = user.subscription?.includes(params.id);

      if (!isAdmin && !isTeacher && !hasSubscription) {
        navigate("/");
      }
    } else {
      navigate("/login"); 
    }
  }, [user, params.id, navigate]);

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures);
    } catch (error) {
      console.log("Error fetching lectures:", error);
    }
  }
  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  async function fetchProgress() {
    try {
      const { data } = await axios.get(`${server}/api/user/progress?course=${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  }
 
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
              <span className="cs-progress-percentage">{completed}%</span>
            </div>
            <div className="cs-progress-bar">
              <div 
                className="cs-progress-fill" 
                style={{ width: `${completed}%` }}
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
            {lectures && lectures.length > 0 ? (
  lectures.map((item, index) => (
    <div key={item._id} className="lec-lecture-item-wrapper">
      <Link to={`/lectures/${course._id}`} className={`lec-lecture-item ${lecture._id === item._id ? "lec-active" : ""}`}>
        <div className="lec-lecture-info">
          <div className="lec-lecture-number">{index + 1}</div>
          <div className="lec-lecture-details">
            <h3 className="lec-lecture-title">{item.title}</h3>
            <div className="lec-lecture-meta">
              <FaVideo className="lec-icon-video" />
              <span>Video Lecture</span>
            </div>
          </div>
        </div>

        <div className="lec-lecture-status">
          {progress[0] && progress[0].completedLectures.includes(item._id) ? (
            <div className="lec-completed-badge">
              <FaCheck style={{backgroundColor: "green", borderRadius:"50%", height:"20px", width:"20px", padding:"3px"}}/>
            </div>
          ) : (
            <div className="lec-play-icon">
              <FaPlay />
            </div>
          )}
        </div>
      </Link>
    </div>
  ))
) : (
  <div className="lec-empty-state">
    <p>No lectures available for this course yet.</p>
    {user && (user.role === "admin" || user.role === "teacher") && (
      <p>Click the + button to add your first lecture!</p>
    )}
  </div>
)}
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
