'use client';

import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import LogoCarousel from './LogoCarousel';

const LOGOS = [
  { name: 'NETZSCH' },
  { name: 'LAMILUX' },
  { name: 'Sandler Group' },
  { name: 'Viessmann' },
  { name: 'Rehau' },
  { name: 'Siemens' },
  { name: 'SAP' },
  { name: 'DHL' },
  { name: 'Kühne+Nagel' },
  { name: 'Datev' },
  { name: 'IHK' },
  { name: 'GEALAN' },
];

export function CarouselSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section 
      aria-label="Aussteller und Partner Logos" 
      className="bg-surface-raised py-12 overflow-hidden"
    >
      <div className="w-full relative px-6 md:px-12">
        <LogoCarousel logos={LOGOS} isPaused={isPaused} />

        {/* Play/Pause Button — Positioned at the bottom-left below the marquee, closer to horizontal divider */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute -bottom-10 left-6 md:left-12 z-20 p-3 bg-[#0D1117]/50 hover:bg-[#0D1117]/80 border border-white/10 rounded-full transition-colors focus-ring"
          aria-label={isPaused ? "Logo-Karussell abspielen" : "Logo-Karussell pausieren"}
          type="button"
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-white" aria-hidden="true" />
          ) : (
            <Pause className="w-5 h-5 text-white" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
export default CarouselSection;

