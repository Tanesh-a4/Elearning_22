import React from "react";
import "./Dashboard.css";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaBookReader, FaChartLine, FaLaptop } from "react-icons/fa";
import Layout from "../../admin/Utils/Layout";

const Dashboard = () => {
    const { userCourses, fetchUserCourses } = CourseData();
    const { user } = UserData();

    const completedCourses = 0; // Placeholder value
    const inProgressCourses = userCourses ? userCourses.length : 0;
    const totalCourses = inProgressCourses + completedCourses;

    return (
        <div style={{marginTop: "100px"}}>
        <Layout role="user">
            <div className="db-container">
            <div className="db-header">
                <div className="db-welcome">
                    <h1 className="db-title">My Learning Dashboard</h1>
                    <p className="db-subtitle">
                        Welcome back, {user ? user.name : "Student"}! Continue your learning journey.
                    </p>
                </div>
            </div>

            <div className="db-stats-row">
                <div className="db-stat-card">
                    <div className="db-stat-icon">
                        <FaGraduationCap />
                    </div>
                    <div className="db-stat-info">
                        <span className="db-stat-value">{totalCourses}</span>
                        <span className="db-stat-label">Total Courses</span>
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-icon db-icon-progress">
                        <FaBookReader />
                    </div>
                    <div className="db-stat-info">
                        <span className="db-stat-value">{inProgressCourses}</span>
                        <span className="db-stat-label">In Progress</span>
                    </div>
                </div>

                <div className="db-stat-card">
                    <div className="db-stat-icon db-icon-completed">
                        <FaChartLine />
                    </div>
                    <div className="db-stat-info">
                        <span className="db-stat-value">{completedCourses}</span>
                        <span className="db-stat-label">Completed</span>
                    </div>
                </div>
            </div>

            <div className="db-section">
                <div className="db-section-header">
                    <h2 className="db-section-title">My Enrolled Courses</h2>
                </div>

                {userCourses && userCourses.length > 0 ? (
                    <div className="db-course-grid">
                        {userCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="db-empty-state">
                        <div className="db-empty-icon">
                            <FaLaptop />
                        </div>
                        <h3 className="db-empty-title">No Courses Enrolled Yet</h3>
                        <p className="db-empty-text">
                            Start your learning journey by enrolling in courses that interest you.
                        </p>
                        <Link to="/courses" className="db-browse-btn">
                            Browse Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
        </Layout>
        </div>
    );
};

export default Dashboard;
