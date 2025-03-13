import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = ({ isAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-lg border-b border-gray-200 ${scrolled ? "shadow-md py-2" : "py-3"}`}
    >
      <nav className="container mx-auto flex items-center justify-between px-6 md:px-10">
        <Link to="/">
          <img src="../../../logo2.svg" alt="QuikLearn Logo" className="w-24 md:w-20 scale-150 transition-all duration-300" />
        </Link>
        
        <div className="hidden md:flex items-center space-x-6 font-medium text-gray-800 text-sm">
          {[
            { path: "/", label: "Home" },
            { path: "/about", label: "About" },
            { path: "/courses", label: "Courses" },
            { path: "/teachers", label: "Teachers" },
            { path: "/faqs", label: "FAQ" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative hover:text-teal-600 transition-all no-underline ${location.pathname === item.path ? "text-teal-600 font-semibold" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={isAuth ? "/account" : "/login"}
            className={`ml-4 px-4 py-1.5 rounded-full transition-all shadow-md text-sm font-semibold no-underline ${
              isAuth
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-teal-100 text-teal-600 hover:bg-teal-200"
            }`}
          >
            {isAuth ? "Account" : "Login"}
          </Link>
        </div>
        
        <button className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </nav>
    </header>
  );
};

export default Header;
