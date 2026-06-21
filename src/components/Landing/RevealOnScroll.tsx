'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

export function RevealOnScroll({
  children,
  className,
  delay,
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !ref.current) return;

    const currentRef = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    // Focus event listener to show the section if focused via keyboard TAB
    const handleFocus = () => {
      currentRef.classList.add('is-visible');
      observer.unobserve(currentRef);
    };

    currentRef.addEventListener('focusin', handleFocus);

    return () => {
      observer.disconnect();
      currentRef.removeEventListener('focusin', handleFocus);
    };
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={cn('reveal-item', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
