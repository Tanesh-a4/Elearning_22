import React, { useState, useEffect } from "react";
import "./Testimonials.css";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import testimonialsData from "./Testimonials.json";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <section 
      className="testimonials-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonials-container">
        <h2 className="testimonials-title">What Our Students Say</h2>
        
        <div className="testimonials-carousel">
          <div className="testimonials-wrapper">
            {testimonialsData.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
              >
                <div className="quote-icon">
                  <FaQuoteLeft />
                </div>
                
                <div className="testimonial-content">
                  <p className="testimonial-message">{testimonial.message}</p>
                  
                  <div className="testimonial-author">
                    <div className="testimonial-image">
                      <img src={testimonial.image} alt={testimonial.name} />
                    </div>
                    <div className="testimonial-info">
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <p className="testimonial-position">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="carousel-controls">
            <button 
              className="control-button prev"
              onClick={handlePrevious}
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>
            
            <div className="carousel-indicators">
              {testimonialsData.map((_, index) => (
                <button 
                  key={index} 
                  className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="control-button next"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;