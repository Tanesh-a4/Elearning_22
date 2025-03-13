import React, { useState, useEffect } from "react";
import "./Faq.css";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { MdOutlineQuestionAnswer, MdLightbulb, MdSupportAgent, MdSchool, MdPayment, MdAccessTime, MdPeople, MdStar } from "react-icons/md";

const FaqSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const toggleFaq = (questionIndex) => {
    setActiveQuestion(activeQuestion === questionIndex ? null : questionIndex);
  };

  // Add search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults(null);
      return;
    }
    
    // Search through all categories and questions
    const results = faqData.map(category => {
      const matchingQuestions = category.questions.filter(
        q => q.title.toLowerCase().includes(query) || 
             q.content.toLowerCase().includes(query)
      );
      
      if (matchingQuestions.length > 0) {
        return {
          ...category,
          questions: matchingQuestions
        };
      }
      return null;
    }).filter(Boolean);
    
    setSearchResults(results.length > 0 ? results : []);
  };

  // Reset search when clicking on a category
  const handleCategoryClick = (index) => {
    setActiveCategory(index);
    setSearchQuery("");
    setSearchResults(null);
    setActiveQuestion(null);
  };

  const faqData = [
    // Your existing FAQ data
    {
      icon: <MdSchool />,
      category: "Courses",
      questions: [
        {
          title: "How do I choose a course?",
          content: "You can browse our course catalog by subject, popularity, or rating. Each course page includes a description, syllabus, and user reviews to help you make an informed decision."
        },
        {
          title: "What is the duration of the courses?",
          content: "Course durations vary depending on the content. Most courses provide an estimated time for completion, typically ranging from a few hours to several weeks."
        },
        {
          title: "Can I access course materials after completing the course?",
          content: "Yes, once you enroll in a course, you will have lifetime access to the course materials, even after you complete it."
        }
      ]
    },
    {
      icon: <MdPayment />,
      category: "Payment & Refunds",
      questions: [
        {
          title: "What payment methods are accepted?",
          content: "We accept various payment methods, including credit/debit cards, PayPal, and bank transfers. All transactions are securely processed and encrypted."
        },
        {
          title: "What is your refund policy?",
          content: "If you are not satisfied with a course, you can request a refund within 30 days after enrollment, provided you have not completed more than 30% of the course content."
        },
        {
          title: "Do you offer any discounts or scholarships?",
          content: "Yes, we regularly offer promotional discounts and have scholarship programs for qualified students. Sign up for our newsletter to stay updated on special offers."
        }
      ]
    },
    {
      icon: <MdPeople />,
      category: "Community",
      questions: [
        {
          title: "Can I interact with other learners?",
          content: "Yes, our platform includes community features where you can engage with fellow learners, participate in discussions, and collaborate on projects through forums and study groups."
        },
        {
          title: "Do you offer mentorship or coaching?",
          content: "Some courses include mentorship or coaching options. Premium courses often feature direct access to instructors, one-on-one feedback, and personalized learning paths."
        },
        {
          title: "Are there any community events or webinars?",
          content: "We host regular webinars, live Q&A sessions with instructors, and virtual networking events. Check our events calendar for upcoming opportunities."
        }
      ]
    },
    {
      icon: <MdSupportAgent />,
      category: "Support",
      questions: [
        {
          title: "How can I contact customer support?",
          content: "Our support team is available via email at support@quiklearn.com, live chat on our website, or through our help center. We typically respond within 24 hours."
        },
        {
          title: "What should I do if I experience technical issues?",
          content: "First, check our troubleshooting guide in the help center. If the issue persists, please contact our technical support team with details about the problem, including any error messages and the device you're using."
        },
        {
          title: "Can I request specific features or courses?",
          content: "Absolutely! We welcome suggestions for platform improvements and new course topics. Please use the feedback form in your account dashboard or email your ideas to feedback@quiklearn.com."
        }
      ]
    }
  ];

  // Display data - either search results or regular categories
  const displayData = searchResults || faqData;

  return (
    <div className="faq-page">
      <div className="faq-header">
        <div className="header-content">
          <MdOutlineQuestionAnswer className="header-icon" />
          <h1>How Can We Help You?</h1>
          <p>Find answers to frequently asked questions about QuikLearn</p>
        </div>
      </div>
      
      <div className="faq-container">
        <div className="faq-sidebar">
          <div className="search-box">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button 
                  className="clear-search" 
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults(null);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="category-list">
            <h3>Categories</h3>
            {faqData.map((category, index) => (
              <div 
                key={index} 
                className={`category-item ${activeCategory === index && !searchResults ? 'active' : ''}`}
                onClick={() => handleCategoryClick(index)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.category}</span>
              </div>
            ))}
          </div>
          
          <div className="help-card">
            <MdLightbulb className="help-icon" />
            <h4>Still have questions?</h4>
            <p>We're here to help you with any specific questions you might have.</p>
            <a href="/contact" className="help-link">Contact Support</a>
          </div>
        </div>
        
        <div className="faq-content">
          {searchResults && searchResults.length === 0 ? (
            <div className="no-results">
              <h3>No results found</h3>
              <p>We couldn't find any questions matching "{searchQuery}".</p>
              <button className="reset-search" onClick={() => {
                setSearchQuery("");
                setSearchResults(null);
              }}>
                Clear Search
              </button>
            </div>
          ) : (
            displayData.map((category, catIndex) => (
              <div 
                key={catIndex} 
                className={`faq-category ${(searchResults || activeCategory === catIndex) ? 'active' : ''}`}
              >
                {(searchResults || activeCategory === catIndex) && (
                  <>
                    <div className="category-header">
                      <span className="category-icon large">{category.icon}</span>
                      <h2>{category.category}</h2>
                    </div>
                    
                    <div className="faq-accordion">
                      {category.questions.map((faq, faqIndex) => (
                        <div 
                          key={faqIndex} 
                          className={`faq-item ${activeQuestion === faqIndex && (!searchResults || catIndex === 0) ? 'active' : ''}`}
                        >
                          <div 
                            className={`faq-question ${activeQuestion === faqIndex && (!searchResults || catIndex === 0) ? 'active' : ''}`}
                            onClick={() => toggleFaq(faqIndex)}
                          >
                            <h3>{faq.title}</h3>
                            {activeQuestion === faqIndex && (!searchResults || catIndex === 0) ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                          
                          {activeQuestion === faqIndex && (!searchResults || catIndex === 0) && (
                            <div className="faq-answer">
                              <p>{faq.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;