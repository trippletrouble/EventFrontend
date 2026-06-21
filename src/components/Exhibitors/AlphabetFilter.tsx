'use client';

import React from 'react';

interface AlphabetFilterProps {
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
}

const LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0-9', 'Sonstige', 'Alle'
];

export function AlphabetFilter({ selectedLetter, onLetterChange }: AlphabetFilterProps) {
  return (
    <nav
      aria-label="Alphabetische Aussteller-Filterung"
      className="w-full border-b border-surface-border/40 pb-4 pt-2"
    >
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm md:text-base font-medium">
        {LETTERS.map((letter) => {
          const isActive = letter === selectedLetter;
          return (
            <li key={letter} className="flex">
              <button
                onClick={() => onLetterChange(letter)}
                className={`relative py-1 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer ${
                  isActive
                    ? 'text-primary font-black scale-105'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
                aria-current={isActive ? 'true' : undefined}
                aria-label={
                  letter === 'Alle'
                    ? 'Alle Aussteller anzeigen'
                    : letter === 'Sonstige'
                    ? 'Aussteller mit sonstigen Zeichen anzeigen'
                    : letter === '0-9'
                    ? 'Aussteller beginnend mit Ziffern anzeigen'
                    : `Aussteller mit Anfangsbuchstabe ${letter} anzeigen`
                }
                type="button"
              >
                <span>{letter}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default AlphabetFilter;
