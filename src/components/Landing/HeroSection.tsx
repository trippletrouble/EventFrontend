'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import { KeywordAnimation } from "@/components/Landing/KeywordAnimation";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Reduced Motion: Video pausieren
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

  // Auto-pause video when out of viewport to reduce scroll lag
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isPlaying) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [isPlaying]);

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
      ref={sectionRef}
      aria-label="Unternehmerbörse 2026 – Karrieremesse"
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
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 transform-gpu"
        poster="/images/hero-bg.jpg"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay — drei Schichten für natürlichen Fade */}
      <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
        {/* Basis-Abdunklung */}
        <div className="absolute inset-0 bg-[#0D1117]/50" />
        {/* Fade von oben (Navbar-Bereich) */}
        <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-[#0D1117] from-[30px] via-[#0D1117]/60 to-transparent" />
        {/* Fade von unten (Übergang zur nächsten Sektion) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/75 to-transparent" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-[1320px] mx-auto w-full px-6 lg:px-12 pt-28 pb-16">

        <div className="relative w-full max-w-xl md:max-w-2xl py-8 pr-8 my-4 select-none -ml-6 lg:-ml-12 pl-6 lg:pl-12">
          <div
            className="absolute inset-y-0 backdrop-blur-sm z-0"
            style={{
              left: '-100vw',
              right: '0px',
              background: 'linear-gradient(90deg, #0D1117 0%, #07090C 70%, transparent 100%)'
            }}
            aria-hidden="true"
          />

          <div
            className="absolute top-0 right-0 flex flex-col z-20"
            style={{ left: '-100vw' }}
            aria-hidden="true"
          >
            <div
              className="h-[6px]"
              style={{ background: 'linear-gradient(90deg, #F5B800 0%, #F5B800 20%, rgba(245, 184, 0, 0) 100%)' }}
            />
            <div
              className="h-[6px]"
              style={{ background: 'linear-gradient(90deg, #2860F9 0%, #2860F9 35%, rgba(40, 96, 249, 0) 100%)' }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-start font-extrabold text-white text-left mt-2 pl-0">
            <h2
              className="text-[32px] md:text-[42px] tracking-wide font-extrabold leading-tight"
              style={{ fontFamily: 'var(--font-lexend-giga, inherit)' }}
            >
              Unternehmerbörse
            </h2>
            <span
              className="text-[100px] md:text-[110px] font-black leading-[0.85] tracking-tighter"
              style={{ fontFamily: 'var(--font-lexend-giga, inherit)' }}
            >
              2026
            </span>
          </div>

          <div
            className="absolute bottom-0 right-0 flex flex-col z-20"
            style={{ left: '-100vw' }}
            aria-hidden="true"
          >
            <div
              className="h-[6px]"
              style={{ background: 'linear-gradient(90deg, #FE3C4E 0%, #FE3C4E 6%, transparent 100%)' }}
            />
            <div
              className="h-[6px]"
              style={{ background: 'linear-gradient(90deg, #0AD88E 0%, #0AD88E 6%, transparent 100%)' }}
            />
          </div>
        </div>

        {/* Unten rechts: Tagline Container (Kompakte Version) */}
        <div className="flex justify-end mt-auto p-6">
          <div className="text-left min-w-[240px] md:min-w-[320px]">

            {/* "Deine" Bereich */}
            <div className="w-full mb-2 relative">
              <div className="flex items-baseline gap-15 w-full">
                <span
                  className="text-[24px] md:text-[40px] font-light text-white tracking-wide pl-1 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-lexend-deca, inherit)' }}
                >
                  Deine
                </span>
                <div
                  className="h-[3px] w-[50vw] mr-[-100vw]"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, #FFFFFF 45%, #FFFFFF 100%)', }}
                  aria-hidden="true"
                />
              </div>
              <div className="h-[3px] bg-white/90 mt-0.5 w-[100vw] mr-[-100vw]" aria-hidden="true" />
            </div>

            {/* Die Tagline-Wörter */}
            <h1 className="leading-[0.95] tracking-wide uppercase">
              {/* ZUKUNFT. */}
              <span
                className="block text-[32px] md:text-[40px] font-black text-white"
                style={{ fontFamily: 'var(--font-lexend-exa, inherit)' }}
              >
                <KeywordAnimation text="ZUKUNFT." delay={200} />
              </span>

              {/* CHANCE. */}
              <span
                className="block text-[44px] md:text-[80px] font-medium text-[#0AD88E] my-0.5"
                style={{ fontFamily: 'var(--font-lexend, inherit)' }}
              >
                <KeywordAnimation text="CHANCE." delay={500} />
              </span>

              {/* KARRIERE. */}
              <span
                className="block text-[32px] md:text-[40px] font-black text-white"
                style={{ fontFamily: 'var(--font-lexend-exa, inherit)' }}
              >
                <KeywordAnimation text="KARRIERE." delay={800} />
              </span>
            </h1>

          </div>
        </div>
      </div>

      {/* Pause-Button — unten links */}
      <button
        onClick={toggleVideo}
        aria-label={isPlaying ? 'Hintergrund-Video pausieren' : 'Hintergrund-Video abspielen'}
        className="absolute bottom-8 left-8 z-20 p-3 bg-[#0D1117]/50 hover:bg-[#0D1117]/80 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        type="button"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" aria-hidden="true" />
        ) : (
          <Play className="w-5 h-5 text-white" aria-hidden="true" />
        )}
      </button>
    </section>
  );
}

export default HeroSection;
