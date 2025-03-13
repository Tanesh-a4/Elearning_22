import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner-outer"></div>
          <div className="spinner-middle"></div>
          <div className="spinner-inner"></div>
        </div>
        <div className="loading-text">
          <span>Q</span>
          <span>u</span>
          <span>i</span>
          <span>k</span>
          <span>L</span>
          <span>e</span>
          <span>a</span>
          <span>r</span>
          <span>n</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;