import React, { useState } from 'react';
import "./Auth.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import { CourseData } from '../../context/CourseContext';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { btnLoading, loginUser } = UserData();
  const { fetchMyCourse } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate, fetchMyCourse);
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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={submitHandler} className="auth-form">
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaUser />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="auth-input"
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaLock />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="auth-input"
              />
            </div>

            <motion.button
              type="submit"
              className="auth-button"
              disabled={btnLoading}
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
                  <FaSignInAlt className="auth-btn-icon" />
                  <span>Login</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p className="auth-text">
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Sign up
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

export default Login;
