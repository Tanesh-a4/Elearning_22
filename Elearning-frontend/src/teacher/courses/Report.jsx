import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaTimes, FaDownload, FaUserGraduate, FaMoneyBillWave, FaStar, FaCalendarAlt } from "react-icons/fa";
import { CourseData } from "../../context/CourseContext";
import "./Report.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Report = ({ course, closeReport }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchCourseAnalytics } = CourseData();
  const params = useParams();
  const courseId = course?._id || params?.id;

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        // Fetch analytics data from the API
        const data = await fetchCourseAnalytics(courseId);
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadReportData();
    }
  }, [courseId, fetchCourseAnalytics]);

  // Function to generate PDF report
  const generatePDF = async () => {
    const reportElement = document.getElementById("course-report");
    const canvas = await html2canvas(reportElement);
    const imgData = canvas.toDataURL("image/png");
    
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${course?.title || "Course"}_Report.pdf`);
  };

  // Format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Prepare chart data for enrollment trends
  const enrollmentData = {
    labels: reportData?.enrollmentTrend?.map(item => item.month) || [],
    datasets: [
      {
        label: "New Enrollments",
        data: reportData?.enrollmentTrend?.map(item => item.count) || [],
        fill: false,
        backgroundColor: "rgba(0, 201, 188, 0.6)",
        borderColor: "#046a6a",
        tension: 0.1
      }
    ]
  };

  // Prepare chart data for revenue trends
  const revenueData = {
    labels: reportData?.revenueTrend?.map(item => item.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: reportData?.revenueTrend?.map(item => item.amount) || [],
        backgroundColor: "rgba(4, 106, 106, 0.6)",
        borderColor: "#035151",
        borderWidth: 1
      }
    ]
  };

  // Prepare chart data for completion rates
  const completionData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [
          reportData?.completionStats?.completed || 0,
          reportData?.completionStats?.inProgress || 0,
          reportData?.completionStats?.notStarted || 0
        ],
        backgroundColor: ["#43a047", "#f57c00", "#e0e0e0"],
        borderColor: ["#2e7d32", "#e65100", "#9e9e9e"],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === "Revenue") {
                label += formatCurrency(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="tc-report-container">
        <div className="tc-report-loading">
          <div className="tc-report-spinner"></div>
          <p>Loading course analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tc-report-container" id="course-report">
      <div className="tc-report-header">
        <h2 className="tc-report-title">Analytics for {course?.title}</h2>
        <div>
          <button className="tc-report-close" onClick={generatePDF} style={{ marginRight: '10px' }}>
            <FaDownload /> Export PDF
          </button>
          <button className="tc-report-close" onClick={closeReport}>
            <FaTimes /> Close
          </button>
        </div>
      </div>
      
      <div className="tc-report-info">
        <div className="tc-report-card">
          <div className="tc-report-card-label">
            <FaUserGraduate /> Total Students
          </div>
          <div className="tc-report-card-value">
            {reportData?.totalStudents || 0}
          </div>
        </div>
        
        <div className="tc-report-card">
          <div className="tc-report-card-label">
            <FaMoneyBillWave /> Total Revenue
          </div>
          <div className="tc-report-card-value">
            {formatCurrency(reportData?.totalRevenue || 0)}
          </div>
        </div>
        
        <div className="tc-report-card">
          <div className="tc-report-card-label">
            <FaStar /> Average Rating
          </div>
          <div className="tc-report-card-value">
            {reportData?.averageRating?.toFixed(1) || "N/A"}
          </div>
        </div>
        
        <div className="tc-report-card">
          <div className="tc-report-card-label">
            <FaCalendarAlt /> Completion Rate
          </div>
          <div className="tc-report-card-value">
            {reportData?.completionRate ? `${reportData.completionRate.toFixed(1)}%` : "N/A"}
          </div>
        </div>
      </div>
      
      <div className="tc-report-chart">
        <h3 className="tc-chart-title">Monthly Enrollments</h3>
        <Line data={enrollmentData} options={chartOptions} />
      </div>
      
      <div className="tc-report-chart">
        <h3 className="tc-chart-title">Monthly Revenue</h3>
        <Bar data={revenueData} options={chartOptions} />
      </div>
      
      <div className="tc-report-chart">
        <h3 className="tc-chart-title">Student Progress</h3>
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <Doughnut data={completionData} options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: "right"
              }
            }
          }} />
        </div>
      </div>
      
      <div className="tc-report-table-container">
        <h3 className="tc-chart-title">Top Students</h3>
        <table className="tc-report-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Joined</th>
              <th>Lessons Completed</th>
              <th className="tc-progress-col">Progress</th>
            </tr>
          </thead>
          <tbody>
            {reportData?.topStudents?.length > 0 ? (
              reportData.topStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                  <td>{student.lessonsCompleted} of {student.totalLessons}</td>
                  <td>
                    <div className="tc-progress-bar">
                      <div 
                        className="tc-progress-fill" 
                        style={{ 
                          width: `${(student.lessonsCompleted / student.totalLessons) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No student data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
