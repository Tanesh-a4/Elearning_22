import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css"; // Include your custom styles if necessary

const Header = ({ isAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container-fluid mh-25">
          <Link className="navbar-brand" to="/">
            <img src="../../../logo2.svg" alt="QuikLearn Logo" id="logo" />
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`} to="/courses">
                  Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/teachers' ? 'active' : ''}`} to="/teachers">
                  Teachers
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/faqs' ? 'active' : ''}`} to="/faqs">
                  FAQ
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link login-link ${location.pathname === '/login' || location.pathname === '/account' ? 'active' : ''}`} 
                  to={isAuth ? "/account" : "/login"}
                >
                  {isAuth ? "Account" : "Login"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
