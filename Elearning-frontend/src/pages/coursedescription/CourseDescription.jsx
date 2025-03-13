import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./CourseDescription.css";
import { CourseData } from '../../context/CourseContext';
import { server } from '../../index.js';
import axios from 'axios';
import { UserData } from '../../context/UserContext';   
import { toast } from 'react-hot-toast';
import Loading from "../../components/loading/Loading";
import { FaClock, FaGraduationCap, FaBookmark, FaUsers, FaRupeeSign, FaCheck } from 'react-icons/fa';

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const {
        data: { order },
      } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        {
          headers: {
            token,
          },
        }
      );

      const options = {
        key: "rzp_test_leLkLRv4XKicDR",
        amount: order.id,
        currency: "INR",
        name: "QuikLearn",
        description: "Learn with us",
        order_id: order.id,

        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          try {
            const { data } = await axios.post(
              `${server}/api/verification/${params.id}`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              },
              {
                headers: {
                  token,
                },
              }
            );

            await fetchCourses();
            await fetchMyCourse();
            toast.success(data.message);
            setLoading(false);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            const errorMessage = error.response?.data?.message || 
                              error.message || 
                              'Payment verification failed';
          
            toast.error(errorMessage);
            setLoading(false);
          }
        },
        theme: {
          color: "#046a6a",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) return <Loading />;
  
  if (!course) return (
    <div className="cd-not-found">
      <div className="cd-not-found-content">
        <h2>Course Not Found</h2>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/courses')} className="cd-back-btn">
          Browse Courses
        </button>
      </div>
    </div>
  );

  // Format bullet points from description
  const formatDescription = () => {
    if (!course.description) return ["No description available."];
    
    // Split on periods, filter out empty strings, and trim each point
    return course.description
      .split('.')
      .filter(point => point.trim().length > 0)
      .map(point => point.trim());
  };

  const descriptionPoints = formatDescription();
  const isEnrolled = user && user.subscription && user.subscription.includes(course._id);

  return (
    <div className="cd-container">
      {/* Hero Section */}
      <div className="cd-hero">
        <div className="cd-hero-content">
          <div className="cd-hero-text">
            <h1 className="cd-title">{course.title}</h1>
            
            <p className="cd-subtitle">
              Master new skills and advance your career with this comprehensive course
            </p>
            
            <div className="cd-meta">
              <div className="cd-meta-item">
                <FaGraduationCap className="cd-meta-icon" />
                <span>{course.createdBy || "Expert Instructor"}</span>
              </div>
              
              <div className="cd-meta-item">
                <FaClock className="cd-meta-icon" />
                <span>{course.duration || "4"} weeks</span>
              </div>
              
              <div className="cd-meta-item">
                <FaBookmark className="cd-meta-icon" />
                <span>{course.category || "Development"}</span>
              </div>
              
              <div className="cd-meta-item">
                <FaUsers className="cd-meta-icon" />
                <span>{course.enrolled || 0} students</span>
              </div>
            </div>
            
            <div className="cd-action">
              <div className="cd-price">
                <FaRupeeSign className="cd-rupee-icon" />
                <span>{course.price || "Free"}</span>
              </div>
              
              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="cd-btn cd-btn-primary"
                >
                  Continue Learning
                </button>
              ) : (
                <button 
                  onClick={checkoutHandler} 
                  className="cd-btn cd-btn-primary"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
          
          <div className="cd-hero-image">
            <div className="cd-image-frame">
              <img
                src={`${server}/${course.image}`}
                alt={course.title || "Course Cover"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400?text=Course+Image";
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Details */}
      <div className="cd-details">
        <div className="cd-details-container">
          <div className="cd-about">
            <h2 className="cd-section-title">About This Course</h2>
            <div className="cd-description">
              {descriptionPoints.length > 0 ? (
                <ul className="cd-description-list">
                  {descriptionPoints.map((point, index) => (
                    <li key={index} className="cd-description-item">
                      <FaCheck className="cd-check-icon" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No description available for this course.</p>
              )}
            </div>
          </div>
          
          <div className="cd-sidebar">
            <div className="cd-sidebar-card">
              <h3 className="cd-sidebar-title">What You'll Learn</h3>
              <ul className="cd-benefits-list">
                <li className="cd-benefit-item">
                  <FaCheck className="cd-check-icon" />
                  <span>Comprehensive understanding of the subject</span>
                </li>
                <li className="cd-benefit-item">
                  <FaCheck className="cd-check-icon" />
                  <span>Practical skills for real-world applications</span>
                </li>
                <li className="cd-benefit-item">
                  <FaCheck className="cd-check-icon" />
                  <span>Industry-relevant knowledge and techniques</span>
                </li>
                <li className="cd-benefit-item">
                  <FaCheck className="cd-check-icon" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>
            
            <div className="cd-sidebar-card">
              <h3 className="cd-sidebar-title">Requirements</h3>
              <ul className="cd-req-list">
                <li className="cd-req-item">Basic understanding of the subject</li>
                <li className="cd-req-item">A computer with internet connection</li>
                <li className="cd-req-item">Enthusiasm to learn and practice</li>
              </ul>
            </div>
            
            {!isEnrolled && (
              <div className="cd-enroll-card">
                <div className="cd-enroll-price">
                  <FaRupeeSign className="cd-rupee-icon" />
                  <span>{course.price || "Free"}</span>
                </div>
                <button 
                  onClick={checkoutHandler} 
                  className="cd-btn cd-btn-primary cd-full-width"
                >
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;