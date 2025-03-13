import React, { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (inputEmail && !validateEmail(inputEmail)) {
      setEmailError("Please enter a valid email (Gmail, Yahoo, or Outlook only)");
    } else {
      setEmailError("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Invalid email address. Please use Gmail, Yahoo, or Outlook.");
      return;
    }
    await registerUser(name, email, password, navigate);
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join our learning platform today</p>
          </div>

          <form onSubmit={submitHandler} className="auth-form">
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="auth-input"
                required
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email address"
                className={`auth-input ${emailError ? "auth-input-error" : ""}`}
                required
              />
            </div>
            {emailError && <div className="auth-error-message">{emailError}</div>}

            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaLock />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="auth-input"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="auth-button"
              disabled={btnLoading || emailError}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {btnLoading ? (
                <div className="auth-loading">
                  <div className="auth-spinner"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                <>
                  <FaUserPlus className="auth-btn-icon" />
                  <span>Register</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p className="auth-text">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
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

export default Register;
