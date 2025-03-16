import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../index";
import Chart from "chart.js/auto";
import "./AdminDashboard.css";
import { FaGraduationCap, FaUsers, FaBookOpen, FaChartLine } from "react-icons/fa";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalcourses: 0,
    totalLectures: 0,
    totalUser: 0
  });
  const [userDistribution, setUserDistribution] = useState([]);
  const [courseRegistrationStats, setCourseRegistrationStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userDistributionChartRef = useRef(null);
  const courseRegistrationChartRef = useRef(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    } else {
      fetchStats();
    }
  }, [user, navigate]);

  async function fetchStats() {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats);
      setUserDistribution(data.stats.userDistribution || []);
      setCourseRegistrationStats(data.stats.courseRegistrationStats || []);
    } catch (error) {
      console.log("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userDistribution.length > 0) {
      const roles = userDistribution.map((item) => item._id);
      const counts = userDistribution.map((item) => item.count);

      const ctx = document.getElementById("userDistributionChart").getContext("2d");

      if (userDistributionChartRef.current) {
        userDistributionChartRef.current.destroy();
      }

      userDistributionChartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: roles,
          datasets: [
            {
              label: "User Distribution",
              data: counts,
              backgroundColor: [
                'rgba(4, 106, 106, 0.8)',
                'rgba(5, 141, 141, 0.8)',
                'rgba(6, 180, 180, 0.8)',
                'rgba(7, 220, 220, 0.8)'
              ],
              borderColor: '#ffffff',
              borderWidth: 2,
              hoverOffset: 10
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: false,
            }
          }
        }
      });
    }

    return () => {
      if (userDistributionChartRef.current) {
        userDistributionChartRef.current.destroy();
      }
    };
  }, [userDistribution]);

  useEffect(() => {
    if (courseRegistrationStats.length > 0) {
      const courseTitles = courseRegistrationStats.map((course) => course.title);
      const userCounts = courseRegistrationStats.map((course) => course.registrationCount);

      const ctx = document.getElementById("courseRegistrationChart").getContext("2d");

      if (courseRegistrationChartRef.current) {
        courseRegistrationChartRef.current.destroy();
      }

      courseRegistrationChartRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: courseTitles,
          datasets: [
            {
              label: "Users Registered",
              data: userCounts,
              backgroundColor: 'rgba(4, 106, 106, 0.7)',
              borderColor: '#046a6a',
              borderWidth: 1,
              borderRadius: 5,
              hoverBackgroundColor: 'rgba(4, 106, 106, 0.9)',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        },
      });
    }

    return () => {
      if (courseRegistrationChartRef.current) {
        courseRegistrationChartRef.current.destroy();
      }
    };
  }, [courseRegistrationStats]);

  return (
    <div className="container-admin">
    <Layout role="Admin">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome to your admin dashboard</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon course-icon">
              <FaGraduationCap />
            </div>
            <div className="stat-details">
              <h3>Total Courses</h3>
              <p className="stat-value">{isLoading ? "..." : stats.totalcourses}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon lecture-icon">
              <FaBookOpen />
            </div>
            <div className="stat-details">
              <h3>Total Lectures</h3>
              <p className="stat-value">{isLoading ? "..." : stats.totalLectures}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon user-icon">
              <FaUsers />
            </div>
            <div className="stat-details">
              <h3>Total Users</h3>
              <p className="stat-value">{isLoading ? "..." : stats.totalUser}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue-icon">
              <FaChartLine />
            </div>
            <div className="stat-details">
              <h3>Revenue Growth</h3>
              <p className="stat-value">+24%</p>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-panel">
            <div className="chart-header">
              <h2>User Distribution</h2>
              <span className="chart-info">Distribution of users by role</span>
            </div>
            <div className="chart-body">
              <canvas id="userDistributionChart"></canvas>
            </div>
          </div>

          <div className="chart-panel">
            <div className="chart-header">
              <h2>Course Popularity</h2>
              <span className="chart-info">Number of users registered for each course</span>
            </div>
            <div className="chart-body bar-chart">
              <canvas id="courseRegistrationChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </div>
  );
};

export default AdminDashboard;
