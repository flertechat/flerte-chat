import { useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * 
 * @param options - IntersectionObserver options
 * @returns ref to attach to the element you want to animate
 */
export function useScrollAnimation<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Optionally unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return elementRef;
}
