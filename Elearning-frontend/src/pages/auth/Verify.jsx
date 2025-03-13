import React, { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { btnLoading, verifyOtp } = UserData();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyOtp(Number(otp), navigate);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <div className="auth-verify-icon">
              <FaShieldAlt />
            </div>
            <h1 className="auth-title">Verify Account</h1>
            <p className="auth-subtitle">
              Enter the verification code sent to your email
            </p>
          </div>

          <form onSubmit={submitHandler} className="auth-form">
            <div className="auth-otp-container">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                className="auth-otp-input"
                required
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            <motion.button
              type="submit"
              className="auth-button"
              disabled={btnLoading || otp.length < 4}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {btnLoading ? (
                <div className="auth-loading">
                  <div className="auth-spinner"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <FaCheckCircle className="auth-btn-icon" />
                  <span>Verify</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p className="auth-text">
              Back to <Link to="/login" className="auth-link">Login</Link>
            </p>
          </div>
        </motion.div>

        <div className="auth-decoration">
          <div className="auth-decoration-circle auth-circle-1"></div>
          <div className="auth-decoration-circle auth-circle-2"></div>
          <div className="auth-decoration-circle auth-circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Verify;