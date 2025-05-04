import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = ({ isAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/courses", label: "Courses" },
    { path: "/teachers", label: "Teachers" },
    { path: "/faqs", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-lg border-b border-gray-200 ${
        scrolled ? "shadow-md py-2" : "py-3"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 md:px-10 py-2">
        <Link to="/">
          <img
            src="/logo2.svg" // Corrected path: assume 'public' folder
            alt="QuikLearn Logo"
            className="w-20 md:w-20 scale-150 transition-all duration-300"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-4 font-medium text-gray-800 text-sm">
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
      className={`relative px-2 py-1 hover:text-teal-600 transition-all no-underline ${
        location.pathname === item.path ? "text-teal-600 font-semibold" : ""
      }`}
    >
      {item.label}
    </Link>
  ))}

  
  <Link
    to="/chat"
    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  </Link>
  <Link
    to={isAuth ? "/account" : "/login"}
    className="px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors bg-teal-600 text-white hover:bg-teal-700"
  >
    {isAuth ? "Account" : "Login"}
  </Link>

</div>


        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden flex flex-col items-center space-y-4 py-4 bg-white shadow-lg absolute w-full left-0 top-full transition-all duration-300 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block text-gray-800 hover:text-teal-600 transition-all"
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to={isAuth ? "/account" : "/login"}
          className="px-4 py-2 rounded-full transition-all shadow-md text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700"
          onClick={() => setMenuOpen(false)}
        >
          {isAuth ? "Account" : "Login"}
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Messages
        </Link>
      </div>
    </header>
  );
};

export default Header;
