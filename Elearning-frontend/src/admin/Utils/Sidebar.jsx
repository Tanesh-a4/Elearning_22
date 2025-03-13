import React, { useState, useEffect } from "react";
import "./common.css";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaChalkboardTeacher, FaBars, FaTimes, FaGraduationCap } from "react-icons/fa";
import { UserData } from "../../context/UserContext";

const Sidebar = () => {
  const { user, logoutUser } = UserData();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const basePath = user?.role === "teacher" ? `/teacher/${user._id}` : "/admin";

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Auto-collapse sidebar on small screens
    if (windowWidth < 768) {
      setSidebarOpen(false);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <FaGraduationCap />
          </div>
          {sidebarOpen && <h1 className="brand-title">Quik<span>Learn</span></h1>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to={`${basePath}/dashboard`} className={location.pathname === `${basePath}/dashboard` ? "active" : ""}>
              <div className="nav-icon">
                <AiFillHome />
              </div>
              {sidebarOpen && <span className="nav-label">Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link to={`${basePath}/course`} className={location.pathname === `${basePath}/course` ? "active" : ""}>
              <div className="nav-icon">
                <FaBook />
              </div>
              {sidebarOpen && <span className="nav-label">Courses</span>}
            </Link>
          </li>

          {user?.role === "admin" && (
            <li>
              <Link to={`${basePath}/users`} className={location.pathname === `${basePath}/users` ? "active" : ""}>
                <div className="nav-icon">
                  <FaUserAlt />
                </div>
                {sidebarOpen && <span className="nav-label">Users</span>}
              </Link>
            </li>
          )}
          
          <li>
            <Link to={`${basePath === "/admin" ? "/" : "/"}`}>
              <div className="nav-icon">
                <FaChalkboardTeacher />
              </div>
              {sidebarOpen && <span className="nav-label">View Site</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logoutUser}>
          <div className="nav-icon">
            <AiOutlineLogout />
          </div>
          {sidebarOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
