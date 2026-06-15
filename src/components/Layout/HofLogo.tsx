'use client';

import React from 'react';
import Link from 'next/link';

interface HofLogoProps {
  className?: string;
  showText?: boolean; // "Hochschule Hof" Text neben dem Icon
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function HofLogo({ className = 'h-9 w-auto', showText = true, href = '/', onClick }: HofLogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-btn text-current"
      aria-label="Hochschule Hof Homepage"
    >
      <svg
        viewBox="0 0 30 30"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Hochschule Hof Logo"
        role="img"
      >
        {/* Gelb — oben links */}
        <rect x="0" y="0" width="10" height="10" fill="#FCCD01" />
        {/* Blau — links mitte+unten */}
        <rect x="0" y="10" width="10" height="20" fill="#2860F8" />
        {/* Weiß — center (nutzt currentColor für Dark/Light Switch) */}
        <rect x="10" y="10" width="10" height="10" fill="currentColor" />
        {/* Grün — rechts oben+mitte */}
        <rect x="20" y="0" width="10" height="20" fill="#0AD88E" />
        {/* Rot — rechts unten */}
        <rect x="20" y="20" width="10" height="10" fill="#FE3D4E" />
      </svg>

      {showText && (
        <div className="hidden sm:flex flex-col justify-center text-[1.05rem] leading-[1.1] font-bold">
          <span>Hochschule</span>
          <span>Hof</span>
        </div>
      )}
    </Link>
  );
}

export default HofLogo;
