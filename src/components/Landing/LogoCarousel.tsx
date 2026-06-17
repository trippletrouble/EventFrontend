'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Logo {
  name: string;
  src?: string;
  url?: string;
}

interface LogoCarouselProps {
  logos: Logo[];
  isPaused: boolean;
}

interface LogoItemProps {
  logo: Logo;
  isDuplicate: boolean;
}

function LogoItem({ logo, isDuplicate }: LogoItemProps) {
  const [hasError, setHasError] = useState(!logo.src);

  return (
    <a
      href={logo.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate ? 'true' : undefined}
      className="flex-shrink-0 flex items-center justify-center h-14 w-36 bg-white rounded-lg p-2.5 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 focus-ring transform-gpu"
      aria-label={`${logo.name} Website öffnen (öffnet in neuem Tab)`}
    >
      {hasError ? (
        <span className="text-slate-800 font-extrabold text-xs tracking-wider whitespace-nowrap select-none">
          {logo.name}
        </span>
      ) : (
        <img
          src={logo.src}
          alt={`${logo.name} Logo`}
          className="h-full w-full object-contain select-none"
          draggable={false}
          onError={() => setHasError(true)}
        />
      )}
    </a>
  );
}

export function LogoCarousel({ logos, isPaused }: LogoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOutOfView, setIsOutOfView] = useState(false);

  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOutOfView(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Dupliziere die Liste mehrmals, um auch auf sehr breiten Bildschirmen einen nahtlosen Loop zu garantieren.
  const doubleLogos = [...logos, ...logos, ...logos, ...logos];

  const animationState = (isPaused || isOutOfView) ? 'paused' : 'running';

  return (
    <div ref={containerRef} className="w-full relative pt-2 pb-14 overflow-hidden">
      {/* Subtiler Schatten links/rechts für weiches Ausblenden */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-raised to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-raised to-transparent z-10 pointer-events-none" />

      <div
        className="flex animate-marquee gap-8 md:gap-12 items-center"
        style={{ animationPlayState: animationState }}
      >
        {doubleLogos.map((logo, i) => {
          const isDuplicate = i >= logos.length;
          return (
            <LogoItem key={i} logo={logo} isDuplicate={isDuplicate} />
          );
        })}
      </div>
    </div>
  );
}

export default LogoCarousel;
