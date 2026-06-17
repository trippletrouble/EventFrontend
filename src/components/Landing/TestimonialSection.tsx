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
        borderClass: 'border-[#0AD88E]',
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
        borderClass: 'border-[#0AD88E]',
    },
];

export function TestimonialSection() {
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [animatedPage, setAnimatedPage] = useState(-1);
    const sectionRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);

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

    useEffect(() => {
        if (!isVisible) return;
        let nextFrame: number;
        const frame = requestAnimationFrame(() => {
            setAnimatedPage(-1);
            nextFrame = requestAnimationFrame(() => setAnimatedPage(activePage));
        });
        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(nextFrame);
        };
    }, [isVisible, activePage]);

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

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (delta > 50) nextPage();
        else if (delta < -50) prevPage();
    };

    return (

        <div className="w-full">
            {/* Über Testimonials — Clean dark bridge */}
            <div className="relative h-2 w-full bg-[#0D1117]" aria-hidden="true">
                <div
                    className="h-2 w-full absolute top-0 left-0 stripe-reveal"
                    style={{
                        background:
                            'linear-gradient(90deg, #0D1117 0%, #0D1117 28%, #FCCD01 100%)',
                    }}
                />
            </div>

            <section className="bg-white text-black py-16" data-navbar="light">
                <div ref={sectionRef} className="container mx-auto px-4 max-w-6xl text-center">
                    <h2 id="testimonial-heading" className="text-[30px] font-extrabold leading-[45px] text-left rounded block pl-20 px-2">Was andere sagen</h2>
                    <hr
                        className="mb-8"
                        style={{
                            width: '90%',
                            border: 'none',
                            borderTop: '3px solid #C5A101',
                            marginTop: '1px',
                            position: 'relative',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                        aria-hidden="true"
                    />

                    {/* Testimonial Carousel Container with Navigation Arrows */}
                    <div className="relative px-10 md:px-12">
                        {/* Left Chevron Button */}
                        <button
                            onClick={prevPage}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full h-8 w-8 border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-black hover:bg-slate-50 focus-ring"
                            aria-label="Vorherige Testimonials anzeigen"
                            type="button"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Slider Cards Wrapper */}
                        <div
                            className="relative overflow-hidden w-full"
                            aria-live="polite"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
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
                                                                'border-2 rounded-[3px] p-6 flex flex-col justify-between bg-white text-black min-h-[140px] md:min-h-[160px] testimonial-card focus-ring',
                                                                t.borderClass,
                                                                animatedPage === pageIdx && 'is-visible'
                                                            )}
                                                            tabIndex={0}
                                                            onFocus={() => {
                                                                if (activePage !== pageIdx) {
                                                                    setActivePage(pageIdx);
                                                                }
                                                            }}
                                                            aria-label={`Testimonial von ${t.name}, ${t.role}: "${t.quote}"`}
                                                >
                                                    <p className="text-[13px] font-normal leading-[1.4] my-auto text-left">{t.quote}</p>
                                                    <footer className="flex justify-between text-[11px] font-extralight text-black pt-2">
                                                        <span className="font-extralight">{t.name}</span>
                                                        <span className="font-extralight">{t.role}</span>
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
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full h-8 w-8 border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-black hover:bg-slate-50 focus-ring"
                            aria-label="Nächste Testimonials anzeigen"
                            type="button"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Clickable Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-8" role="group" aria-label="Testimonial-Seiten">
                        {pages.map((_, idx) => {
                            const isActive = activePage === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActivePage(idx)}
                                    className={cn(
                                        "transition-all duration-300 border border-black rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                                        isActive
                                            ? "w-[25px] h-[6px] bg-black"
                                            : "w-[6px] h-[6px] bg-transparent hover:bg-black/30"
                                    )}
                                    aria-label={`Gehe zu Testimonial-Seite ${idx + 1}`}
                                    aria-current={isActive || undefined}
                                    type="button"
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
            <div className="relative h-2 w-full bg-[#0D1117]" aria-hidden="true">
                <div
                    className="h-2 w-full absolute bottom-0 left-0 stripe-reveal"
                    style={{
                        background:
                            'linear-gradient(90deg, #FCCD01 0%, #0D1117 72%, #0D1117 100%)',
                    }}
                />
            </div>

            {/* Unter Testimonials — Clean dark bridge */}
            <div className="h-2 w-full bg-[#0D1117]" aria-hidden="true" />
        </div>
    );
}

export default TestimonialSection;