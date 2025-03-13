import React from "react";
import { MdDashboard, MdPerson, MdEmail, MdSchool, MdVideoLibrary, MdSettings, MdStar } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { FaChalkboardTeacher, FaUserShield, FaCertificate, FaBell, FaBookmark } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Account.css";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  const applyToBecomeTeacher = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${user._id}`,
        { designation: "teacher" },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success("Request Sent for Updation");
      setUser((prevUser) => ({ ...prevUser, designation: "teacher" }));
    } catch (error) {
      toast.error("Failed to apply as teacher");
    }
  };

  // Generate initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role display name and icon
  const getRoleInfo = () => {
    switch (user.role) {
      case "admin":
        return { name: "Administrator", icon: <FaUserShield /> };
      case "teacher":
        return { name: "Teacher", icon: <FaChalkboardTeacher /> };
      default:
        return { name: "Student", icon: <MdPerson /> };
    }
  };

  // Get designation status display
  const getDesignationStatus = () => {
    if (user.role !== "user") return null;
    
    if (user.designation === "teacher") {
      return {
        text: "Teacher application is pending approval",
        status: "pending"
      };
    }
    return null;
  };

  const designationStatus = getDesignationStatus();
  const roleInfo = getRoleInfo();

  return (
    <div className="profile-page">
      <div className="profile-header-bg">
        <div className="header-content container">
          <div className="user-welcome">
            <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p>Manage your account and learning journey</p>
          </div>
        </div>
      </div>

      <div className="profile-content container">
        {/* User Profile Card */}
        <section className="profile-card">
          <div className="card-header">
            <div className="profile-avatar">
              {getInitials()}
            </div>
            <div className="profile-info">
              <h2>{user?.name}</h2>
              <div className="role-badge">
                {roleInfo.icon}
                <span>{roleInfo.name}</span>
              </div>
            </div>
          </div>

          <div className="card-content">
            <div className="profile-detail-row">
              <div className="detail-label">
                <MdEmail />
                <span>Email</span>
              </div>
              <div className="detail-value">{user?.email}</div>
            </div>

            {designationStatus && (
              <div className={`status-alert ${designationStatus.status}`}>
                <FaBell />
                <span>{designationStatus.text}</span>
              </div>
            )}
            
            <div className="action-buttons">
              <button onClick={logoutHandler} className="btn btn-logout">
                <IoMdLogOut /> Logout
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Access */}
        <section className="dashboard-section">
          <h2 className="section-title">Your Dashboard</h2>
          <div className="dashboard-cards">
            <div className="dash-card" onClick={() => navigate(`/${user?._id}/dashboard`)}>
              <div className="card-icon primary">
                <MdDashboard />
              </div>
              <div className="card-info">
                <h3>Learning Dashboard</h3>
                <p>Access your courses and track progress</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
            
            {user?.role === "admin" && (
              <div className="dash-card" onClick={() => navigate('/admin/dashboard')}>
                <div className="card-icon admin">
                  <FaUserShield />
                </div>
                <div className="card-info">
                  <h3>Admin Dashboard</h3>
                  <p>Manage users and platform content</p>
                </div>
                <div className="card-arrow">→</div>
              </div>
            )}
            
            {user?.role === "teacher" && (
              <div className="dash-card" onClick={() => navigate(`/teacher/${user?._id}/dashboard`)}>
                <div className="card-icon teacher">
                  <FaChalkboardTeacher />
                </div>
                <div className="card-info">
                  <h3>Teacher Dashboard</h3>
                  <p>Manage your courses and students</p>
                </div>
                <div className="card-arrow">→</div>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-cards">
            <div className="action-card" onClick={() => navigate('/courses')}>
              <div className="action-icon">
                <MdVideoLibrary />
              </div>
              <h3>Explore Courses</h3>
            </div>
            
            <div className="action-card" onClick={() => navigate(`/${user?._id}/bookmarks`)}>
              <div className="action-icon">
                <FaBookmark />
              </div>
              <h3>Saved Courses</h3>
            </div>
            
            <div className="action-card" onClick={() => navigate(`/${user?._id}/certificates`)}>
              <div className="action-icon">
                <FaCertificate />
              </div>
              <h3>Certificates</h3>
            </div>
            
            {user?.designation !== "teacher" && user?.role === "user" && (
              <div className="action-card" onClick={applyToBecomeTeacher}>
                <div className="action-icon">
                  <MdSchool />
                </div>
                <h3>Become Teacher</h3>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;
