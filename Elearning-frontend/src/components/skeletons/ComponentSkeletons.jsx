import React from 'react';
import './ComponentSkeletons.css';

export const SliderSkeleton = () => (
  <div className="slider-skeleton">
    <div className="skeleton-hero">
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-subtitle"></div>
      <div className="skeleton-button"></div>
    </div>
    <div className="skeleton-icons">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-icon"></div>
      ))}
    </div>
  </div>
);

export const CoursesHomeSkeleton = () => (
  <div className="courses-skeleton">
    <div className="skeleton-text skeleton-section-title"></div>
    <div className="skeleton-courses-grid">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-course-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text skeleton-short"></div>
        </div>
      ))}
    </div>
  </div>
);

export const TeachersHomeSkeleton = () => (
  <div className="teachers-skeleton">
    <div className="skeleton-text skeleton-section-title"></div>
    <div className="skeleton-teachers-grid">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-teacher-card">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text skeleton-short"></div>
        </div>
      ))}
    </div>
  </div>
);

export const TestimonialsSkeleton = () => (
  <div className="testimonials-skeleton">
    <div className="skeleton-text skeleton-section-title"></div>
    <div className="skeleton-testimonials-grid">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-testimonial">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text skeleton-short"></div>
        </div>
      ))}
    </div>
  </div>
);