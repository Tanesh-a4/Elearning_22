import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import './Home.css';
import Testimonials from '../../components/testimonials/Testimonials.jsx';
import CoursesHome from '../../components/courseshome/CoursesHome.jsx';
import Slider from '../../components/slider/Slider.jsx';
import FaqsHome from '../../components/faqshome/FaqsHome.jsx';
import TeachersHome from '../../components/teachershome/TeachersHome.jsx';

const Home = () => {
  const navigate = useNavigate();

  const { ref: cardRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="home-page-container">
      <Slider />
      <CoursesHome />
      <TeachersHome />
      <FaqsHome />
      <div className="home-banner-section">
        <div
          className={`home-banner-card ${inView ? 'home-banner-visible' : ''}`}
          ref={cardRef}
        >
          <h1 className="home-banner-title">Welcome to Our Platform!</h1>
          <p className="home-banner-text">
            Explore our courses, connect with experts, and achieve your learning goals.
          </p>
          <Link to="/courses" className="home-banner-button">
            Get Started
            <span className="home-banner-button-icon">→</span>
          </Link>
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;
