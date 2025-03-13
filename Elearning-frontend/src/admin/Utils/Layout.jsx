import React from "react";
import Sidebar from "./Sidebar";
import "./common.css";
import { FaBars } from "react-icons/fa";

const Layout = ({ children }) => {
  const toggleMobileSidebar = () => {
    document.querySelector('.sidebar').classList.toggle('sidebar-mobile-open');
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <div className="admin-topbar">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <FaBars />
          </button>
          <div className="admin-topbar-right">
            <div className="admin-profile">
              <span className="admin-badge">Admin</span>
              <div className="admin-avatar">A</div>
            </div>
          </div>
        </div>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

export default Layout;