import React, { useState, useEffect } from 'react';
import './FaqsHome.css';
import { Link } from 'react-router-dom';

const FaqsHome = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation when component mounts
    setIsVisible(true);
  }, []);
  
  const faqs = {
    rows: [
      {
        title: "How do I choose a course?",
        content: "You can browse our course catalog by subject, popularity, or rating. Each course page includes a description, syllabus, and user reviews to help you make an informed decision."
      },
      {
        title: "What is the duration of the courses?",
        content: "Course durations vary depending on the content. Most courses provide an estimated time for completion, typically ranging from a few hours to several weeks.",
      },
      {
        title: "Can I access course materials after completing the course?",
        content: "Yes, once you enroll in a course, you will have lifetime access to the course materials, even after you complete it.",
      },
      {
        title: "Are there any prerequisites for taking courses?",
        content: "Prerequisites vary by course. Some are designed for beginners while others may require prior knowledge. Each course page clearly lists any prerequisites needed.",
      },
      {
        title: "How do I get a certificate after completing a course?",
        content: "Upon successful completion of course requirements, you can download your certificate directly from your dashboard. Certificates can be shared on LinkedIn or added to your resume.",
      },
      {
        title: "What payment methods do you accept?",
        content: "We accept all major credit cards, PayPal, and bank transfers. Some regions also have additional local payment options available at checkout.",
      }
    ]
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="home-faq-wrapper">
      <div className="home-faq-sections">
        <div className="home-faq-header">
          <h2 className={`home-faq-title ${isVisible ? 'home-visible' : ''}`}>Frequently Asked Questions</h2>
          <div className="home-faq-subtitle">Everything you need to know about our platform</div>
        </div>
        
        <div className="home-faq-container">
          {faqs.rows.map((faq, index) => (
            <div 
              className={`home-faq-accordion ${activeIndex === index ? 'home-active' : ''}`} 
              key={index}
              onClick={() => toggleFAQ(index)}
            >
              <div className="home-faq-question">
                <h3>{faq.title}</h3>
                <div className="home-faq-icon">
                  <span className="home-icon-bar"></span>
                  <span className="home-icon-bar"></span>
                </div>
              </div>
              <div className="home-faq-answer">
                <p>{faq.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="home-faq-footer">
          <p>Still have questions?</p>
          <Link to="/faqs" className="home-contact-btn">View All FAQs</Link>
        </div>
      </div>
    </div>
  );
};

export default FaqsHome;