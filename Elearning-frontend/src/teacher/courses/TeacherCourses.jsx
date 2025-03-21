import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Added useParams here
import Layout from "../../admin/Utils/Layout";
import { CourseData } from "../../context/CourseContext";
import Report from "./Report";
import "./TeacherCourses.css";
import { server } from "../../index";
import { 
  FaPlus, 
  FaChartLine, 
  FaEdit, 
  FaTrashAlt, 
  FaUsers, 
  FaClock,
  FaBookOpen,
  FaCloudUploadAlt
} from "react-icons/fa";
import { toast } from "react-toastify";
import { UserData } from "../../context/UserContext";
import axios from "axios";

const TeacherCourses = () => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = CourseData();
  const { userId } = useParams(); // Using useParams to get the userId
  const [showReport, setShowReport] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  // Fetch teacher courses using fetchMyCourse
  const { 
   // Renamed from teacherCourses //userdata
    loading, //userdata
    fetchMyCourse, // Renamed from fetchTeacherCourses // course data
    deleteCourse,
    deleteLoading 
  } = CourseData();
const {teacherDashboardData, user, fetchTeacherDashboard} = UserData();
console.log(teacherDashboardData)

const mycourse = teacherDashboardData?.courses;
console.log(teacherDashboardData)
console.log(mycourse)
  // Fetch courses when component mounts
  useEffect(() => {
    fetchMyCourse();
  }, []);

  const handleViewReport = (course) => {
    setSelectedCourse(course);
    setShowReport(true);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/update-course/${courseId}`);
  };

  const confirmDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };
console.log(mycourse?.[0]?.id)
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/course/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchCourses();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const closeReport = () => {
    setShowReport(false);
    setSelectedCourse(null);
  };

  const getCategoryColor = (category) => {
    const categories = {
      "Programming": "var(--primary)",
      "Design": "#9c27b0",
      "Business": "#f57c00",
      "Marketing": "#e91e63",
      "Science": "#2196f3",
      "Health": "#43a047",
      "Language": "#795548",
      "Other": "#607d8b"
    };
    return categories[category] || "var(--primary)";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  return (
   <>
    <div className="tc-layout">
    <Layout className="tc-layout" role="Teacher">
      <div className="tc-container">
        <div className="tc-header">
          <h1>My Courses</h1>
          <Link to={`/teacher/${userId}/add-course`} className="tc-add-btn"> {/* Updated link here */}
            <FaPlus className="tc-add-btn-icon" />
            Create New Course
          </Link>
        </div>
        
        {loading ? (
          <div className="tc-loading">
            <div className="tc-spinner"></div>
          </div>
        ) : mycourse && mycourse.length > 0 ? (
          <div className="tc-courses-grid">
            {mycourse.map((course) => (
              <div className="tc-course-card" key={course._id}>
                <div className="tc-card-image-container">
                  <img 
                     src={course.image ? `${server}/${course.image}` : "https://placehold.co/100x60?text=Course"}
                    alt={course.title} 
                    className="tc-card-image" 
                  />
                  <div className="tc-card-overlay">
                    <span 
                      className="tc-course-category" 
                      style={{ backgroundColor: `${getCategoryColor(course.category)}20`, color: getCategoryColor(course.category) }}
                    >
                      {course.category}
                    </span>
                  </div>
                </div>
                <div className="tc-card-body">
                  <h3 className="tc-card-title">{course.title}</h3>
                  <p className="tc-card-description">{course.description}</p>
                  
                  <div className="tc-card-meta">
                    <div className="tc-meta-item">
                      <FaUsers className="tc-meta-icon" />
                      <span>{course.subscriptions || 0} Students</span>
                    </div>
                    <div className="tc-meta-item">
                      <FaClock className="tc-meta-icon" />
                      <span>{course.duration || "N/A"}</span>
                    </div>
                  </div>
                  
                  <div className="tc-card-price">{formatPrice(course.price)}</div>
                  
                  <div className="tc-card-actions">
                    <button 
                      className="tc-btn tc-btn-info" 
                      onClick={() => handleViewReport(course)}
                    >
                      <FaChartLine className="tc-action-icon" /> Analytics
                    </button>
                    <button 
                      className="tc-btn tc-btn-primary" 
                      onClick={() => navigate(`/course/study/${course._id}`)}
                    >
                      <FaEdit className="tc-action-icon" /> Add Lecture
                    </button>
                    <button 
                      className="tc-btn tc-btn-danger" 
                     onClick={() => {
                      console.log(course._id);
                      
                      deleteHandler(course._id)}}
                    >
                      <FaTrashAlt className="tc-action-icon" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tc-empty-state">
            <div className="tc-empty-icon">
              <FaBookOpen />
            </div>
            <h3>No courses found</h3>
            <p>You haven't created any courses yet. Start by creating your first course.</p>
            <Link to={`/teacher/${userId}/add-course`} className="tc-add-btn"> {/* Updated link here */}
              <FaPlus className="tc-add-btn-icon" />
              Create Your First Course
            </Link>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="tc-modal-overlay" onClick={closeDeleteModal}>
            <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tc-modal-header">
                <h3 className="tc-modal-title">Delete Course</h3>
                <button className="tc-close-modal" onClick={closeDeleteModal}>×</button>
              </div>
              <div className="tc-modal-body">
                <p>Are you sure you want to delete <strong>{courseToDelete?.title}</strong>? This action cannot be undone.</p>
                <div className="tc-form-footer">
                  <button className="tc-cancel-btn" onClick={closeDeleteModal}>Cancel</button>
                  <button 
                    className="tc-btn tc-btn-danger" 
                 
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <span className="tc-btn-loading">
                        <div className="tc-btn-spinner"></div>
                        Deleting...
                      </span>
                    ) : (
                      <>
                        <FaTrashAlt className="tc-action-icon" /> 
                        Delete Course
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Component */}
        {showReport && selectedCourse && (
  <div className="popup-overlay">
    <div className="popup-content">
      <Report course={selectedCourse} closeReport={closeReport} />
      
    </div>
  </div>
)}

      </div>
    </Layout>
    </div>
    </>
  );
};

export default TeacherCourses;
