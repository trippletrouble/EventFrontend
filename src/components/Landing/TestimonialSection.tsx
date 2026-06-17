'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  borderClass: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Über die Unternehmerbörse habe ich meinen Werkstudentenjob gefunden. Ein Jahr später schrieb ich dort meine Bachelorarbeit.',
    name: 'Maria K.',
    role: 'Studentin',
    borderClass: 'border-[#2860F9]',
  },
  {
    quote: 'Die Hochschule Hof ist die wichtigste Talentequelle der Region. Wir sind seit 5 Jahren dabei und jedes Mal begeistert.',
    name: 'Thomas W.',
    role: 'TechCorp GmbH',
    borderClass: 'border-[#FE3D4E]',
  },
  {
    quote: 'Durch die direkten Gespräche mit Unternehmen konnte ich schnell Kontakte aufbauen. Das hat mir bei meiner weiteren Karriereplanung sehr geholfen.',
    name: 'Leon M.',
    role: 'Student',
    borderClass: 'border-[#068053]',
  },
  {
    quote: 'Hervorragende Organisation! Wir konnten direkt am Stand Vorstellungsgespräche führen und zwei Werkstudenten einstellen.',
    name: 'Sandra B.',
    role: 'HR Manager, WebDev AG',
    borderClass: 'border-[#2860F9]',
  },
  {
    quote: 'Die Gespräche waren sehr locker und auf Augenhöhe. Perfekt, um unverbindlich in verschiedene Berufsfelder reinzuschnuppern.',
    name: 'Jonas S.',
    role: 'Absolvent',
    borderClass: 'border-[#FE3D4E]',
  },
  {
    quote: 'Es ist die perfekte Plattform für regionale Unternehmen, um sich den Fachkräften von morgen als attraktiver Arbeitgeber zu präsentieren.',
    name: 'Dr. Michael P.',
    role: 'CEO, InnoTech GmbH',
    borderClass: 'border-[#068053]',
  },
];

export function TestimonialSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
      setActivePage(0); // Reset page on resize to prevent index out of bounds
    };

    const timer = setTimeout(() => {
      setIsMounted(true);
      handleResize(); // Initial check
    }, 0);

    mediaQuery.addEventListener('change', handleResize);
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTimeout(() => setIsVisible(true), 0);
      return;
    }
    const current = sectionRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.05 });

    observer.observe(current);
    return () => observer.disconnect();
  }, []);

  // Group testimonials into pages depending on responsive viewport size
  const pages: Testimonial[][] = [];
  if (!isMounted || !isMobile) {
    // Desktop: 3 cards per page
    for (let i = 0; i < TESTIMONIALS.length; i += 3) {
      pages.push(TESTIMONIALS.slice(i, i + 3));
    }
  } else {
    // Mobile: 1 card per page
    for (let i = 0; i < TESTIMONIALS.length; i++) {
      pages.push([TESTIMONIALS[i]]);
    }
  }

  const prevPage = () => {
    setActivePage((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
  };

  const nextPage = () => {
    setActivePage((prev) => (prev === pages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* Über Testimonials — Clean dark bridge */}
      <div className="h-2 w-full bg-[#0D1117]" aria-hidden="true" />

      <section className="bg-white text-black py-16" data-navbar="light">
        <div ref={sectionRef} className="container mx-auto px-4 max-w-6xl text-center">
          <h2 id="testimonial-heading" tabIndex={0} className="text-[30px] font-extrabold leading-[45px] text-center focus-ring rounded inline-block px-2">Was andere sagen</h2>
          <div className="h-[2px] w-full max-w-3xl mt-3 mb-12 mx-auto bg-[#2860F9] stripe-reveal-center" aria-hidden="true" />

          {/* Testimonial Carousel Container with Navigation Arrows */}
          <div className="relative px-10 md:px-12">
            {/* Left Chevron Button */}
            <button
              onClick={prevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full h-8 w-8 border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-[#2860F9] hover:bg-slate-50 focus-ring"
              aria-label="Vorherige Testimonials anzeigen"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slider Cards Wrapper */}
            <div className="relative overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activePage * 100}%)` }}
              >
                {pages.map((pageItems, pageIdx) => (
                  <div
                    key={pageIdx}
                    className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 px-1"
                  >
                    {pageItems.map(t => {
                      return (
                        <blockquote key={t.name}
                          className={cn(
                            `border-2 ${t.borderClass} rounded-[3px] p-6 flex flex-col justify-between bg-white text-black min-h-[220px] md:min-h-[240px] testimonial-card focus-ring`,
                            isVisible && 'is-visible'
                          )}
                          tabIndex={0}
                          onFocus={() => {
                            if (activePage !== pageIdx) {
                              setActivePage(pageIdx);
                            }
                          }}
                          aria-label={`Testimonial von ${t.name}, ${t.role}: "${t.quote}"`}
                        >
                          <p className="text-[13px] font-normal leading-[1.4] mb-6">{t.quote}</p>
                          <footer className="flex justify-between text-[13px] font-normal text-slate-600 border-t border-slate-100 pt-4">
                            <cite className="not-italic font-semibold text-slate-800">{t.name}</cite>
                            <span>{t.role}</span>
                          </footer>
                        </blockquote>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Chevron Button */}
            <button
              onClick={nextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full h-8 w-8 border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-[#2860F9] hover:bg-slate-50 focus-ring"
              aria-label="Nächste Testimonials anzeigen"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Clickable Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial-Seiten">
            {pages.map((_, idx) => {
              const isActive = activePage === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePage(idx)}
                  className={cn(
                    "transition-all duration-300 border border-[#2860F9] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860F9] focus-visible:ring-offset-2",
                    isActive
                      ? "w-[25px] h-[6px] bg-[#2860F9]"
                      : "w-[6px] h-[6px] bg-transparent hover:bg-[#2860F9]/30"
                  )}
                  aria-label={`Gehe zu Testimonial-Seite ${idx + 1}`}
                  aria-selected={isActive}
                  role="tab"
                  type="button"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Unter Testimonials — Clean dark bridge */}
      <div className="h-2 w-full bg-[#0D1117]" aria-hidden="true" />
    </div>
  );
}

export default TestimonialSection;
