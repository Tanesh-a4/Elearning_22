  import React, { useState, useEffect } from "react";
  import { data, useParams } from "react-router-dom";
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
  import axios from "axios"
  import { server } from "../..";

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
    const [lectures, setLectures] = useState([]);
    const [error, setError] = useState(null);
    const [avgProgress, setAvgProgress] = useState(null);
    const params = useParams();
    const courseId = course?._id || params?.id;

    useEffect(() => {
      const loadReportData = async () => {
          try {
              setLoading(true);
              const { data } = await axios.get(`${server}/api/courses/${courseId}/report`, {
                  headers: { token: localStorage.getItem("token") }
              });
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
  }, [courseId]);
  console.log(reportData)

  useEffect(() => {
    const fetchLectures = async () => {
        try {
            const { data } = await axios.get(`${server}/api/lectures/${courseId}`, {
              headers: { token: localStorage.getItem("token") }
            });
            setLectures(data.lectures);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching lectures");
        }
    };

    fetchLectures();
}, [courseId]);
console.log(lectures)



useEffect(() => {
  if (!reportData || !reportData.progress || !lectures.length) return;

  const totalProgress = reportData.progress.reduce((sum, student) => {
    return sum + (student.completedLectures / lectures.length) * 100;
  }, 0);

  const calculatedAvg = totalProgress / reportData.progress.length || 0;
  setAvgProgress(calculatedAvg);
}, [reportData, lectures]);




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
      labels: reportData?.progress?.map(student => student.name) || [],
      datasets: [
        {
          label: "Completion Percentage",
          data: reportData?.progress?.map(student => (student.completedLectures / lectures.length) * 100) || [],
          backgroundColor: ["#ff9800","#4caf50", "#f44336", "#2196f3", "#9c27b0"],
          hoverBackgroundColor: ["#388e3c", "#f57c00", "#d32f2f", "#1976d2", "#7b1fa2"]
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
            <button className="tc-report-close" onClick={generatePDF} style={{ marginRight: '10px', marginBottom: '4px' }}>
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
              {reportData?.totalSubscribers || 0}
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
    <FaCalendarAlt /> Completion Rate
  </div>
  <div className="tc-report-card-value">
    {avgProgress !== null ? `${avgProgress.toFixed(1)}%` : "N/A"}
  </div>
</div>

        </div>
        
        {/* <div className="tc-report-chart">
          <h3 className="tc-chart-title">Monthly Enrollments</h3>
          <Line data={enrollmentData} options={chartOptions} />
        </div>
        
        <div className="tc-report-chart">
          <h3 className="tc-chart-title">Monthly Revenue</h3>
          <Bar data={revenueData} options={chartOptions} />
        </div> */}
        
        <div className="tc-report-chart">
  <h3 className="tc-chart-title">Student Progress</h3>
  <div className="tc-report-chart">
  <h3 className="tc-chart-title">Student Progress</h3>
  <div className="tc-chart-container">
    {reportData?.progress?.map((student, index) => {
      const completed = student.completedLectures;
      const total = lectures.length;
      const remaining = total - completed;

      const studentData = {
        labels: ["Completed", "Remaining"],
        datasets: [
          {
            data: [completed, remaining],
            backgroundColor: ["#4CAF50", "#D3D3D3"], // Green for completed, Grey for remaining
          },
        ],
      };

      return (
        <div key={index} style={{ maxWidth: "250px", margin: "10px auto" }}>
          <h4>{student.name}</h4>
          <Doughnut 
            data={studentData} 
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { position: "bottom" }
              }
            }} 
          />
        </div>
      );
    })}
  </div>
</div>

</div>;
        
        <div className="tc-report-table-container">
          <h3 className="tc-chart-title">Top Students</h3>
          <table className="tc-report-table">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Lectures Completed</th>
      <th>Total Lectures</th>
    </tr>
  </thead>
  <tbody>
    {reportData?.progress?.length > 0 ? (
      reportData.progress.map((student, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{student.name}</td>
          <td>{student.completedLectures}</td>
          <td>{lectures.length}</td>
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
