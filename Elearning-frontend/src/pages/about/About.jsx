import React from 'react';
import './About.css';
import { FaGraduationCap, FaLaptopCode, FaChartLine, FaUsers, FaGlobe, FaAward, FaBookOpen, FaClock, FaCertificate } from 'react-icons/fa';
import Testimonials from '../../components/testimonials/Testimonials';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <video autoPlay loop muted className="hero-video">
          <source src="/Anthem_V6.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>Transforming Education<br /><span>Empowering Futures</span></h1>
          <p>Experience learning reimagined with QuikLearn's innovative approach to online education</p>
        </div>
      </div>
      
      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="section-divider"></div>
          </div>
          <div className="mission-content">
            <div className="mission-text">
              <p>
                At <strong>QuikLearn</strong>, we believe that quality education should be accessible to everyone, everywhere. 
                Our mission is to bridge the gap between traditional learning and the dynamic needs of today's digital world.
              </p>
              <p>
                We're committed to creating an environment where learners can discover their potential, 
                gain practical skills, and confidently pursue their professional dreams - all at their own pace 
                and on their own terms.
              </p>
            </div>
            <div className="mission-stats">
              <div className="stat-card">
                <span className="stat-number">1,000+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">100+</span>
                <span className="stat-label">Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>What Sets Us Apart</h2>
            <div className="section-divider"></div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaGraduationCap />
              </div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry veterans and academic experts who bring real-world experience to every lesson.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaLaptopCode />
              </div>
              <h3>Hands-On Learning</h3>
              <p>Build practical skills through interactive projects, coding exercises, and real-world applications.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Career Growth</h3>
              <p>Develop professionally relevant skills that employers value and advance your career opportunities.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3>Flexible Scheduling</h3>
              <p>Learn at your own pace with on-demand content available 24/7 on any device, anywhere.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Community Support</h3>
              <p>Connect with fellow learners, participate in forums, and collaborate on group projects.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaCertificate />
              </div>
              <h3>Verified Certificates</h3>
              <p>Earn industry-recognized certificates to showcase your skills and knowledge to employers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="path-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Your Learning Journey</h2>
            <div className="section-divider"></div>
          </div>
          <div className="journey-steps">
            <div className="journey-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Discover</h3>
                <p>Browse our extensive catalog of courses across multiple disciplines and find what inspires you.</p>
              </div>
            </div>
            <div className="journey-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Learn</h3>
                <p>Engage with interactive content, video lectures, and practical assignments at your own pace.</p>
              </div>
            </div>
            <div className="journey-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Apply</h3>
                <p>Put your knowledge to work with hands-on projects and real-world problem-solving.</p>
              </div>
            </div>
            <div className="journey-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Achieve</h3>
                <p>Earn certificates, build your portfolio, and advance your career with your new skills.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="testimonial-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Student Success Stories</h2>
            <div className="section-divider"></div>
          </div>
          <Testimonials />
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Learning Journey?</h2>
          <p>Join thousands of learners who've transformed their lives with QuikLearn</p>
          <div className="cta-buttons">
            <Link className="cta-button primary" to="/courses">Explore Courses</Link>
            <Link className="cta-button secondary" to="/contact">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;