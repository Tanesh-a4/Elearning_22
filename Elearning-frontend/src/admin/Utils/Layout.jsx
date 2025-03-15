import React from "react";
import Sidebar from "./Sidebar";
import "./common.css";
import { FaBars } from "react-icons/fa";

const Layout = ({ children, role = "User" }) => {
  console.log("User Role:", role); // Debugging to check role value

  const toggleMobileSidebar = () => {
    document.querySelector(".sidebar").classList.toggle("sidebar-mobile-open");
  };

  // Determine badge text and avatar letter based on role
  let badgeText = "User";
  let avatarLetter = "U";

  if (role === "Admin") {
    badgeText = "Admin";
    avatarLetter = "A";
  } else if (role === "Teacher") {
    badgeText = "Teacher";
    avatarLetter = "T";
  }

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
              <span className="admin-badge">{badgeText}</span>
              <div className="admin-avatar">{avatarLetter}</div>
            </div>
          </div>
        </div>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
