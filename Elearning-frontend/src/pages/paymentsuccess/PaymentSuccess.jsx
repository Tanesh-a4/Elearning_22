import React, { useEffect } from "react";
import "./PaymentSuccess.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaGraduationCap, FaArrowRight, FaCreditCard, FaCalendarCheck } from "react-icons/fa";
import confetti from 'canvas-confetti';

const PaymentSuccess = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const paymentId = params.id;
  
  // Format current date for receipt
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  useEffect(() => {
    // Trigger confetti effect when component mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since they're launched randomly, let's add some randomness to the config
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#046a6a', '#00c9bc', '#FFDD00', '#FF7A00', '#FF006D'],
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#046a6a', '#00c9bc', '#FFDD00', '#FF7A00', '#FF006D'],
      });
    }, 250);
    
    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <div className="ps-container">
        <div className="ps-error-card">
          <h2>Session Expired</h2>
          <p>Please log in again to view your payment details.</p>
          <button 
            className="ps-button ps-secondary-button"
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-container">
      <motion.div 
        className="ps-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="ps-card-header">
          <motion.div 
            className="ps-success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaCheckCircle />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            className="ps-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Your course subscription has been activated
          </motion.p>
        </div>

        <motion.div 
          className="ps-receipt"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="ps-receipt-header">
            <div className="ps-receipt-logo">
              <FaGraduationCap />
              <span>QuikLearn</span>
            </div>
            <div className="ps-receipt-date">
              <FaCalendarCheck className="ps-icon" />
              {formattedDate}
            </div>
          </div>

          <div className="ps-receipt-content">
            <div className="ps-receipt-row">
              <span className="ps-label">Transaction ID</span>
              <span className="ps-value ps-transaction-id">{paymentId}</span>
            </div>
            <div className="ps-receipt-row">
              <span className="ps-label">Student</span>
              <span className="ps-value">{user.name}</span>
            </div>
            <div className="ps-receipt-row">
              <span className="ps-label">Email</span>
              <span className="ps-value">{user.email}</span>
            </div>
            <div className="ps-receipt-row">
              <span className="ps-label">Payment Method</span>
              <span className="ps-value">
                <FaCreditCard className="ps-icon" /> Credit Card
              </span>
            </div>
            <div className="ps-receipt-row ps-total-row">
              <span className="ps-label">Status</span>
              <span className="ps-value ps-success-text">Paid</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="ps-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to={`/user/dashboard`} className="ps-button ps-primary-button">
            <span>Start Learning Now</span>
            <FaArrowRight className="ps-button-icon" />
          </Link>
          
          <Link to="/courses" className="ps-button ps-secondary-button">
            Browse More Courses
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;