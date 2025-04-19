import React from "react";
import { FaGlobeAsia, FaAngleUp, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full text-gray-700 text-sm bg-white border-t border-gray-200">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h4 className="text-teal-700 text-lg font-bold mb-4">QuikLearn</h4>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:text-teal-600 transition">QuikLearn for Business</a></li>
              <li><a href="/account" className="hover:text-teal-600 transition">Become an Instructor</a></li>
              <li><a href="/mobile" className="hover:text-teal-600 transition">Mobile Apps</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-teal-700 text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-teal-600 transition">About Us</a></li>
              <li><a href="/careers" className="hover:text-teal-600 transition">Careers</a></li>
              <li><a href="/blog" className="hover:text-teal-600 transition">Blog</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-teal-700 text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/topics" className="hover:text-teal-600 transition">Topics</a></li>
              <li><a href="/support" className="hover:text-teal-600 transition">Support</a></li>
              <li><a href="/affiliate" className="hover:text-teal-600 transition">Affiliate</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-teal-700 text-lg font-bold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="https://linkedin.com" className="p-2 rounded-full bg-gray-100 hover:bg-teal-600 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
              <a href="https://twitter.com" className="p-2 rounded-full bg-gray-100 hover:bg-teal-600 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="p-2 rounded-full bg-gray-100 hover:bg-teal-600 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
            </div>
            <a href="/contact" className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-teal-600 hover:text-white transition">
              <FaGlobeAsia /> Contact Us <FaAngleUp />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-gray-100 border-t border-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo & Copyright */}
          <div className="flex items-center space-x-4">
            <a href="/">
              <img src="/images/logo2.svg" alt="QuikLearn" className="w-24" />
            </a>
            <span className="text-gray-600 text-sm">© 2024 QuikLearn, Inc.</span>
          </div>

          {/* Links */}
          <ul className="flex space-x-6 text-gray-600 text-sm">
            <li><a href="https://drive.google.com/file/d/1aLZzXga1so7-seV2U6I0k35-F4LDWiih/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition">Terms</a></li>
            <li><a href="https://drive.google.com/file/d/1zzef2-c1plB8wmdeOG9X6ZNFGAnJHwZ6/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition">Privacy Policy</a></li>
            <li><a href="/intellectual-property" className="hover:text-teal-600 transition">Intellectual Property</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
