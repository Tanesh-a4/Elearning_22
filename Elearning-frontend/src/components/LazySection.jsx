import React, { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

const LazySection = ({ children, fallback, rootMargin = '50px' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazySection;