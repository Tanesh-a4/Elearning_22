import React, { useState, useEffect } from "react";
import "./CourseCard.css";
import { server } from "../../index";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";
import { FaClock, FaChalkboardTeacher, FaRupeeSign, FaBookOpen, FaSignInAlt, FaTrashAlt } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap'; // Add this import

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPreviouslyPaid, setHasPreviouslyPaid] = useState(false);

  useEffect(() => {
    if (user && Array.isArray(user.subscription) && user.subscription.includes(course._id)) {
      setIsEnrolled(true);
    }
    
    // Check if user previously paid for this course
    const checkPaymentHistory = async () => {
      if (isAuth && user) {
        try {
          const { data } = await axios.get(
            `${server}/api/check-payment-history/${course._id}`,
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );
          setHasPreviouslyPaid(data.hasPaid);
        } catch (error) {
          console.error("Error checking payment history:", error);
        }
      }
    };
    
    checkPaymentHistory();
  }, [user, course._id, isAuth]);

  const unenrollHandler = async (courseId) => {
    try {
      const { data } = await axios.post(
        `${server}/api/unenroll`,
        { courseId, user },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setIsEnrolled(false); 
      fetchCourses(); 
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

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

  // Add this function to handle enrollment with payment check
  const handleEnrollment = () => {
    if (hasPreviouslyPaid) {
      // If previously paid, directly enroll without payment
      directEnrollHandler(course._id);
    } else {
      // Show payment confirmation modal
      setShowPaymentModal(true);
    }
  };

  // Add this function for direct enrollment (no payment needed)
  const directEnrollHandler = async (courseId) => {
    try {
      const { data } = await axios.post(
        `${server}/api/direct-enroll`,
        { courseId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      setIsEnrolled(true);
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };

  return (
    <div 
      className="cc-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cc-card">
        <div className="cc-image-container">
          <img 
            src={`${server}/${course.image}`} 
            alt={course.title} 
            className="cc-image" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=Course+Image";
            }}
          />
          {isEnrolled && (
            <div className="cc-badge">
              <div className="cc-badge-icon">
                <FaBookOpen />
              </div>
              <span>Enrolled</span>
            </div>
          )}
          <div className="cc-overlay">
            <div className="cc-overlay-content">
              <button 
                onClick={() => isAuth 
                  ? (isEnrolled 
                      ? navigate(`/course/study/${course._id}`) 
                      : navigate(`/course/${course._id}`)) 
                  : navigate("/login")
                }
                className="cc-preview-btn"
              >
                {isEnrolled ? 'Start Learning' : 'View Details'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="cc-content">
          <h3 className="cc-title" title={course.title}>{course.title}</h3>
          
          <div className="cc-meta">
            <div className="cc-meta-item">
              <FaChalkboardTeacher className="cc-icon" />
              <span title={course.createdBy}>{course.createdBy}</span>
            </div>
            <div className="cc-meta-item">
              <FaClock className="cc-icon" />
              <span>{course.duration} weeks</span>
            </div>
          </div>
          
          <div className="cc-price">
            <FaRupeeSign className="cc-rupee-icon" />
            <span>{course.price}</span>
          </div>
          
          <div className="cc-actions">
            {isAuth ? (
              <>
                {user && user.role !== "admin" ? (
                  <>
                    {isEnrolled ? (
                      <div className="cc-button-group">
                        <button
                          onClick={() => navigate(`/course/study/${course._id}`)}
                          className="cc-btn cc-btn-primary"
                        >
                          <FaBookOpen className="cc-btn-icon" /> Study Now
                        </button>
                        <button
                          onClick={() => unenrollHandler(course._id)}
                          className="cc-btn cc-btn-outline"
                        >
                          Unenroll
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEnrollment}
                        className="cc-btn cc-btn-primary cc-full-width"
                      >
                        Get Started
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/course/study/${course._id}`)}
                    className="cc-btn cc-btn-primary cc-full-width"
                  >
                    <FaBookOpen className="cc-btn-icon" /> View Course
                  </button>
                )}
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="cc-btn cc-btn-primary cc-full-width">
                <FaSignInAlt className="cc-btn-icon" /> Sign In to Enroll
              </button>
            )}
            
            {user && user.role === "admin" && (
              <button
                onClick={() => deleteHandler(course._id)}
                className="cc-btn cc-btn-danger cc-admin-btn"
              >
                <FaTrashAlt className="cc-btn-icon" /> Delete Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to proceed to payment for "{course.title}"?</p>
          <p>Course Price: ₹{course.price}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowPaymentModal(false);
              navigate(`/course/${course._id}`);
            }}
          >
            Yes, Continue to Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseCard;
