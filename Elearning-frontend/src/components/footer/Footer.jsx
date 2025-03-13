import React from "react";
import "./Footer.css";
import { FaGlobeAsia, FaAngleUp, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-column">
            <h4 className="footer-heading">QuikLearn</h4>
            <ul className="footer-list">
              <li><a href="/business">QuikLearn for Business</a></li>
              <li><a href="/teach">Become an Instructor</a></li>
              <li><a href="/mobile">Mobile Apps</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-list">
              <li><a href="/topics">Topics</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/affiliate">Affiliate</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Connect</h4>
            <div className="footer-social">
              <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
            <a href="/contact" className="contact-button">
              <FaGlobeAsia /> Contact Us <FaAngleUp />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-logo">
            <a href="/">
              <img src="/images/logo2.svg" alt="QuikLearn" width="110" />
            </a>
            <span className="copyright">Copyright © 2024 QuikLearn, Inc.</span>
          </div>

          <div className="footer-links">
            <ul>
              <li><a href="https://drive.google.com/file/d/1aLZzXga1so7-seV2U6I0k35-F4LDWiih/view?usp=sharing" target="_blank" rel="noopener noreferrer">Terms</a></li>
              <li><a href="https://drive.google.com/file/d/1zzef2-c1plB8wmdeOG9X6ZNFGAnJHwZ6/view?usp=sharing" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="/intellectual-property">Intellectual Property</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
