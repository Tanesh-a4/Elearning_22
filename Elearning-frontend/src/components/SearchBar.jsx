import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  // Styles
  const formStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    width: "100%",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
    position: "relative",
    borderRadius: "50px",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
    boxShadow: isFocused 
      ? "0 5px 20px rgba(4, 106, 106, 0.15)" 
      : "0 3px 15px rgba(0, 0, 0, 0.08)",
    border: isFocused 
      ? "2px solid rgba(4, 106, 106, 0.3)" 
      : "2px solid transparent",
    transform: isFocused 
      ? "translateY(-2px)" 
      : "translateY(0)",
  };

  const inputStyle = {
    flex: 1,
    padding: "14px 20px",
    fontSize: "16px",
    border: "none",
    background: "transparent",
    borderRadius: "50px",
    outline: "none",
    color: "#333",
    fontFamily: "inherit",
    width: "100%",
  };

  const buttonStyle = {
    backgroundColor: "#046a6a",
    border: "none",
    color: "white",
    borderRadius: "0 50px 50px 0",
    padding: "14px 25px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#035858",
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Media query handling for responsive design
  const getResponsiveStyles = () => {
    const width = window.innerWidth;
    
    if (width <= 480) {
      return {
        container: {
          maxWidth: "100%",
        },
        input: {
          padding: "10px 16px",
          fontSize: "14px",
        },
        button: {
          padding: "10px 18px",
        },
        icon: {
          fontSize: "14px",
        },
      };
    } else if (width <= 768) {
      return {
        container: {
          maxWidth: "90%",
        },
        input: {
          padding: "12px 18px",
          fontSize: "15px",
        },
        button: {
          padding: "12px 20px",
        },
        icon: {
          fontSize: "15px",
        },
      };
    }
    
    return {
      container: {},
      input: {},
      button: {},
      icon: { fontSize: "16px" },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <form 
      onSubmit={handleSubmit} 
      style={formStyle}
    >
      <div style={{
        ...containerStyle,
        ...responsiveStyles.container,
      }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for courses..."
          style={{
            ...inputStyle,
            ...responsiveStyles.input,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Search courses"
        />
        <button 
          type="submit" 
          style={isButtonHovered ? {
            ...buttonHoverStyle,
            ...responsiveStyles.button,
          } : {
            ...buttonStyle,
            ...responsiveStyles.button,
          }}
          onMouseOver={() => setIsButtonHovered(true)}
          onMouseOut={() => setIsButtonHovered(false)}
          aria-label="Search"
        >
          <FaSearch style={responsiveStyles.icon} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
