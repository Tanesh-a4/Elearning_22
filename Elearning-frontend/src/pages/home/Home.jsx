import React, { useEffect, useState, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import './Home.css';
import LazySection from '../../components/LazySection.jsx';
import { 
  SliderSkeleton, 
  CoursesHomeSkeleton, 
  TeachersHomeSkeleton, 
  TestimonialsSkeleton 
} from '../../components/skeletons/ComponentSkeletons.jsx';

// Lazy imports
const Slider = lazy(() => import('../../components/slider/Slider.jsx'));
const CoursesHome = lazy(() => import('../../components/courseshome/CoursesHome.jsx'));
const TeachersHome = lazy(() => import('../../components/teachershome/TeachersHome.jsx'));
const Testimonials = lazy(() => import('../../components/testimonials/Testimonials.jsx'));
const FaqsHome = lazy(() => import('../../components/faqshome/FaqsHome.jsx'));

const Home = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { ref: cardRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="home-page-container">
      <LazySection fallback={<SliderSkeleton />}>
        <Slider pauseAnimations={isScrolling} />
      </LazySection>
      
      <LazySection fallback={<CoursesHomeSkeleton />}>
        <CoursesHome />
      </LazySection>
      
      <LazySection fallback={<TeachersHomeSkeleton />}>
        <TeachersHome />
      </LazySection>
      
      <LazySection fallback={<div className="skeleton-section" />}>
        <FaqsHome />
      </LazySection>
      
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
      
      <LazySection fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </LazySection>
    </div>
  );
};

export default Home;
