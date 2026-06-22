'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play, ChevronDown } from 'lucide-react';
import {KeywordAnimation} from "@/components/Landing/KeywordAnimation";

interface HeroSectionProps {
    title?: string;
    year?: string;
    taglineStart?: string;
    tagwords?: string[];
    showScrollIndicator?: boolean;
    scrollToId?: string;
}

export function HeroSection({
    title = 'Unternehmerbörse',
    year = '2027',
    taglineStart = 'Deine',
    tagwords = ['ZUKUNFT.', 'CHANCE.', 'KARRIERE.'],
    showScrollIndicator = false,
    scrollToId
}: HeroSectionProps = {}) {
    const handleScrollClick = () => {
        if (!scrollToId) return;
        const element = document.getElementById(scrollToId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mq.matches && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }

        const handler = (e: MediaQueryListEvent) => {
            if (e.matches && videoRef.current) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const toggleVideo = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <section
            aria-label={`${title} ${year === '2027' ? '2026' : year} – Karrieremesse`}
            className="relative min-h-screen flex flex-col overflow-hidden"
            data-navbar="dark"
        >
            {/* Video-Hintergrund (oder Gradient-Placeholder) */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                poster="/images/hero-bg.jpg"
            >
                <source src="/videos/hero.webm" type="video/webm" />
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            {/* Overlay — drei Schichten für natürlichen Fade */}
            <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
                {/* Basis-Abdunklung */}
                <div className="absolute inset-0 bg-surface/50" />
                {/* Fade von oben (Navbar-Bereich) */}
                <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-surface from-[30px] via-surface/60 to-transparent" />
                {/* Fade von unten (Übergang zur nächsten Sektion) */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface via-surface/75 to-transparent" />
            </div>

            {/* Logo */}
            <div className="relative z-10 flex-1 flex flex-col justify-between max-w-[1320px] mx-auto w-full px-6 lg:px-12 pt-28 pb-16">

                <div className="relative w-full max-w-xl md:max-w-2xl py-8 pr-8 my-4 select-none -ml-6 lg:-ml-12 pl-6 lg:pl-12">
                    <div
                        className="absolute inset-y-0 left-[-100vw] right-0 backdrop-blur-sm z-0 bg-[linear-gradient(90deg,var(--color-surface)_0%,#07090C_70%,transparent_100%)]"
                        aria-hidden="true"
                    />

                    <div
                        className="absolute top-0 right-0 left-[-100vw] flex flex-col z-20"
                        aria-hidden="true"
                    >
                        <div className="h-[6px] bg-[linear-gradient(90deg,#F5B800_0%,#F5B800_20%,transparent_100%)]" />
                        <div className="h-[6px] bg-[linear-gradient(90deg,#2860F9_0%,#2860F9_35%,transparent_100%)]" />
                    </div>

                    <div className="relative z-10 flex flex-col items-start font-extrabold text-white text-left mt-2 pl-0">
                        <h1 className="text-[32px] md:text-[42px] tracking-wide font-extrabold leading-tight font-lexend-giga">
                            {title}
                            <span className="block text-[100px] md:text-[110px] font-black leading-[0.85] tracking-tighter font-lexend-giga">
                                {year}
                            </span>
                        </h1>
                    </div>

                    <div
                        className="absolute bottom-0 right-0 left-[-100vw] flex flex-col z-20"
                        aria-hidden="true"
                    >
                        <div className="h-[6px] bg-[linear-gradient(90deg,#FE3C4E_0%,#FE3C4E_6%,transparent_100%)]" />
                        <div className="h-[6px] bg-[linear-gradient(90deg,#0AD88E_0%,#0AD88E_6%,transparent_100%)]" />
                    </div>
                </div>

                {/* Unten rechts: Tagline Container (Kompakte Version) */}
                <div className="flex justify-end mt-auto p-6">
                    <div className="text-left min-w-[240px] md:min-w-[320px]">

                        {/* "Deine" Bereich */}
                        <div className="w-full mb-2 relative">
                            <div className="flex items-baseline gap-15 w-full">
                                <span className="text-[24px] md:text-[40px] font-light text-white tracking-wide pl-1 whitespace-nowrap font-lexend-deca">
                                    {taglineStart}
                                </span>
                                <div
                                    className="h-[3px] w-[50vw] mr-[-100vw] bg-[linear-gradient(90deg,transparent_0%,#FFFFFF_45%,#FFFFFF_100%)]"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="h-[3px] bg-white/90 mt-0.5 w-[100vw] mr-[-100vw]" aria-hidden="true" />
                        </div>

                        {/* Die Tagline-Wörter */}
                        <h2 className="leading-[0.95] tracking-wide uppercase">
                            {tagwords.map((word, index) => {
                                const isSecond = index === 1;
                                const fontClass = isSecond ? 'font-sans' : 'font-lexend-exa';
                                const sizeClass = isSecond
                                    ? 'text-[44px] md:text-[80px] font-medium text-[#0AD88E] my-0.5'
                                    : 'text-[32px] md:text-[40px] font-black text-white';
                                return (
                                    <span
                                        key={`${word}-${index}`}
                                        className={`block ${sizeClass} ${fontClass}`}
                                    >
                                        <KeywordAnimation text={word} delay={150 + index * 200} />
                                    </span>
                                );
                            })}
                        </h2>

                    </div>
                </div>
            </div>

            {/* Pause-Button — unten links */}
            <button
                onClick={toggleVideo}
                aria-label={isPlaying ? 'Hintergrund-Video pausieren' : 'Hintergrund-Video abspielen'}
                className="absolute bottom-8 left-8 z-20 p-3 bg-surface/50 hover:bg-surface/80 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                type="button"
            >
                {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" aria-hidden="true" />
                ) : (
                    <Play className="w-5 h-5 text-white" aria-hidden="true" />
                )}
            </button>

            {/* Scroll-Indicator — unten mitte */}
            {showScrollIndicator && scrollToId && (
                <button
                    onClick={handleScrollClick}
                    aria-label="Zum Ticketshop herunterscrollen"
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 p-3 bg-surface/50 hover:bg-surface/80 text-white rounded-full transition-all cursor-pointer animate-bounce focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                    type="button"
                >
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                </button>
            )}
        </section>
    );
}