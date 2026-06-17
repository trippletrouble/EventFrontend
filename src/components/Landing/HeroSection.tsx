'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

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
        className="absolute inset-0 w-full h-full object-cover z-0 transform-gpu"
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
        <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-[#0D1117] from-[80px] via-[#0D1117]/60 to-transparent" />
        {/* Fade von unten (Übergang zur nächsten Sektion) */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/90 to-transparent" />
      </div>

      {/* Inhalt */}
      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-[1320px] mx-auto w-full px-6 lg:px-12 pt-28 pb-16">

        {/* Oben links: Event-Titel */}
        <div>
          <p
            className="font-extrabold text-[28px] leading-[53px] text-white tracking-wide"
            style={{ fontFamily: 'var(--font-lexend-giga, inherit)' }}
          >
            Unternehmerbörse
          </p>
          <p
            className="font-extrabold text-[120px] md:text-[160px] leading-none text-white -mt-2"
            style={{ fontFamily: 'var(--font-lexend-giga, inherit)' }}
          >
            2026
          </p>
        </div>

        {/* Unten rechts: Tagline */}
        <div className="flex justify-end mt-auto">
          <div className="text-right max-w-lg">
            {/* "Deine" mit weißer Linie */}
            <div className="flex items-center justify-end gap-6 mb-4">
              <div className="h-[2px] bg-white/80 flex-1 max-w-[300px]" aria-hidden="true" />
              <span
                className="text-[32px] md:text-[40px] font-light text-white/90 tracking-wider"
                style={{ fontFamily: 'var(--font-lexend-deca, inherit)' }}
              >
                Deine
              </span>
            </div>

            <h1 className="leading-none">
              <span
                className="block text-[36px] md:text-[40px] font-black text-white uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-lexend-exa, inherit)' }}
              >
                Zukunft.
              </span>
              <span
                className="block text-[64px] md:text-[80px] font-medium text-[#0AD88E] italic"
                style={{ fontFamily: 'var(--font-lexend, inherit)' }}
              >
                Chance.
              </span>
              <span
                className="block text-[36px] md:text-[40px] font-black text-white uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-lexend-exa, inherit)' }}
              >
                Karriere.
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
