'use client';

import React from 'react';

interface LogoCarouselProps {
  logos: { name: string }[];
  isPaused: boolean;
}

export function LogoCarousel({ logos, isPaused }: LogoCarouselProps) {
  // Dupliziere die Liste mehrmals, um auch auf sehr breiten Bildschirmen einen nahtlosen Loop zu garantieren.
  const doubleLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-full relative pt-2 pb-14 overflow-hidden">
      {/* Subtiler Schatten links/rechts für weiches Ausblenden */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-raised to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-raised to-transparent z-10 pointer-events-none" />

      <div
        className="flex animate-marquee gap-8 md:gap-12 items-center"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {doubleLogos.map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-12 w-32 bg-surface-overlay border border-surface-border/80 rounded-md flex items-center justify-center shadow-sm select-none"
          >
            <span className="text-foreground/80 font-extrabold text-xs tracking-wider whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoCarousel;
