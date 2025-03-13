import React from "react";
import "./SideColumn.css";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaCheck } from "react-icons/fa";

const SideColumn = ({ filters, setFilters }) => {
  const navigate = useNavigate();

  // Handler for checkbox changes
  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[type].includes(value)) {
        updated[type] = updated[type].filter((item) => item !== value);
      } else {
        updated[type].push(value);
      }
      return updated;
    });
  };

  // Handler for range filters (price and duration)
  const handleRangeChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  // Check if a checkbox should be checked
  const isChecked = (type, value) => {
    return filters[type].includes(value);
  };

  return (
    <div className="side-column">
      <div className="filter-header">
        <FaFilter className="filter-icon" />
        <h3>Filter Courses</h3>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <h4>Category</h4>
        <div className="filter-options">
          <label className={`checkbox-label ${isChecked("category", "Web Development") ? "selected" : ""}`}>
            <input
              type="checkbox"
              value="Web Development"
              checked={isChecked("category", "Web Development")}
              onChange={() => handleCheckboxChange("category", "Web Development")}
            />
            <span className="checkbox-custom">
              {isChecked("category", "Web Development") && <FaCheck className="check-icon" />}
            </span>
            Web Development
          </label>
          
          <label className={`checkbox-label ${isChecked("category", "Data Science") ? "selected" : ""}`}>
            <input
              type="checkbox"
              value="Data Science"
              checked={isChecked("category", "Data Science")}
              onChange={() => handleCheckboxChange("category", "Data Science")}
            />
            <span className="checkbox-custom">
              {isChecked("category", "Data Science") && <FaCheck className="check-icon" />}
            </span>
            Data Science
          </label>
          
          <label className={`checkbox-label ${isChecked("category", "Artificial Intelligence") ? "selected" : ""}`}>
            <input
              type="checkbox"
              value="Artificial Intelligence"
              checked={isChecked("category", "Artificial Intelligence")}
              onChange={() => handleCheckboxChange("category", "Artificial Intelligence")}
            />
            <span className="checkbox-custom">
              {isChecked("category", "Artificial Intelligence") && <FaCheck className="check-icon" />}
            </span>
            Artificial Intelligence
          </label>
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="select-wrapper">
          <select
            onChange={(e) => handleRangeChange("priceRange", e.target.value)}
            value={filters.priceRange || ""}
          >
            <option value="">All Prices</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-5000">₹1000 - ₹5000</option>
          </select>
        </div>
      </div>

      {/* Duration Filter */}
      <div className="filter-group">
        <h4>Duration (Weeks)</h4>
        <div className="select-wrapper">
          <select
            onChange={(e) => handleRangeChange("duration", e.target.value)}
            value={filters.duration || ""}
          >
            <option value="">Any Duration</option>
            <option value="0-4">0 - 4 weeks</option>
            <option value="4-8">4 - 8 weeks</option>
            <option value="8-12">8 - 12 weeks</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button 
        className="reset-filters"
        onClick={() => setFilters({
          category: [],
          priceRange: "",
          duration: ""
        })}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SideColumn;