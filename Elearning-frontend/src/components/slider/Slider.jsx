import React, { useState, useEffect } from "react";
import "./Slider.css";
import { Link } from "react-router-dom";

const Slider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: "images/carousal1.png",
      buttonText: "Explore Courses",
      buttonLink: "/courses"
    },
    {
      id: 2,
      image: "images/carousel-2.png",
      buttonText: "Start Learning",
      buttonLink: "/courses"
    },
    {
      id: 3,
      image: "images/carousel-3.png",
      buttonText: "Join Now",
      buttonLink: "/signup"
    }
  ];
  
  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  // Navigate to specific slide
  const goToSlide = (index) => {
    setActiveSlide(index);
  };
  
  // Navigate to previous slide
  const prevSlide = () => {
    setActiveSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length);
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    setActiveSlide(prevSlide => (prevSlide + 1) % slides.length);
  };
  
  return (
    <section className="carousel-container">
      <div className="carousel">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
            style={{backgroundImage: `url(${slide.image})`}}
          >
            <Link to={slide.buttonLink} className="carousel-button">
              {slide.buttonText}
            </Link>
          </div>
        ))}
        
        <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous slide">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button className="carousel-control next" onClick={nextSlide} aria-label="Next slide">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        <div className="carousel-indicators">
          {slides.map((slide, index) => (
            <button 
              key={slide.id} 
              className={`carousel-indicator ${index === activeSlide ? 'active' : ''}`} 
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;
