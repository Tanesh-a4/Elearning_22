import React from "react";
import "./Courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import SearchBar from "../../components/SearchBar"; // Import the SearchBar
import Sidebar from "../../components/SideColumn/SideColumn"; // Import the Sidebar
import { useState, useEffect } from "react";

const Courses = () => {
  const { courses } = CourseData();
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredCourses, setFilteredCourses] = useState(courses); // Filtered courses
  const [filters, setFilters] = useState({
    category: [],
    createdBy: [],
    priceRange: "",
    duration: "",
  }); // Filters state

  // Filter courses based on search query and filters
  useEffect(() => {
    let filtered = courses;

    // Apply Search Query Filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply Category Filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((course) =>
        filters.category.includes(course.category)
      );
    }

    // Apply Teacher Filter
    if (filters.createdBy.length > 0) {
      filtered = filtered.filter((course) =>
        filters.createdBy.includes(course.createdBy)
      );
    }

    // Apply Price Filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-");
      filtered = filtered.filter(
        (course) => course.price >= Number(min) && course.price <= Number(max)
      );
    }

    // Apply Duration Filter
    if (filters.duration) {
      const [min, max] = filters.duration.split("-");
      filtered = filtered.filter(
        (course) =>
          course.duration >= Number(min) && course.duration <= Number(max)
      );
    }

    setFilteredCourses(filtered); // Update the filtered courses state
  }, [searchQuery, filters, courses]);

  // Handle search input changes
  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state
  };

  return (
    <div className="crs-page">
      {/* Sidebar for filters */}
      <div className="crs-sidebar">
        <Sidebar filters={filters} setFilters={setFilters} />
      </div>

      {/* Main content */}
      <div className="crs-main-content">
        <h2 className="crs-heading">Available Courses</h2>

        {/* Add the SearchBar component */}
        <SearchBar onSearch={handleSearch} />

        <div className="crs-grid">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <div className="crs-no-courses">No Courses Found!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
