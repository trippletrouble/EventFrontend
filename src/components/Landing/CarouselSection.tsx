'use client';

import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import LogoCarousel from './LogoCarousel';

const LOGOS = [
  { name: 'NETZSCH', src: '/logos/netzsch.svg', url: 'https://www.netzsch.com' },
  { name: 'Lamilux', src: '/logos/lamilux.svg', url: 'https://www.lamilux.de' },
  { name: 'Sandler', src: '/logos/sandler.svg', url: 'https://www.sandler.de' },
  { name: 'dennree', src: '/logos/dennree.png', url: 'https://www.dennree.de' },
  { name: 'Bundeswehr', src: '/logos/bundeswehr.svg', url: 'https://www.bundeswehrkarriere.de' },
  { name: 'Agentur für Arbeit', src: '/logos/agentur-fuer-arbeit.svg', url: 'https://www.arbeitsagentur.de' },
  { name: 'AOK', src: '/logos/aok.svg', url: 'https://www.aok.de' },
  { name: 'Techniker Krankenkasse', src: '/logos/techniker-krankenkasse.svg', url: 'https://www.tk.de' },
  { name: 'HUK-Coburg', src: '/logos/huk-coburg.svg', url: 'https://www.huk.de' },
  { name: 'Viessmann', src: '/logos/viessmann.svg', url: 'https://www.viessmann.de' },
  { name: 'Gebrüder Weiss', src: '/logos/gebrueder-weiss.svg', url: 'https://www.gw-world.com' },
  { name: 'NKD', src: '/logos/nkd.svg', url: 'https://www.nkd.com' },
  { name: 'Hetzner', src: '/logos/hetzner.svg', url: 'https://www.hetzner.com' },
  { name: 'Wilo', src: '/logos/wilo.svg', url: 'https://www.wilo.com' },
  { name: 'Enterprise', src: '/logos/enterprise.svg', url: 'https://www.enterprise.de' },
  { name: 'CeramTec', src: '/logos/ceramtec.svg', url: 'https://www.ceramtec.de' }
];

export function CarouselSection() {
  const [isPaused, setIsPaused] = useState(true);

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

