/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
'use client';

import { useState, useEffect } from 'react';

interface CountdownSectionProps {
    targetDate?: string;
}

function calculateTimeLeft(target: string) {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return null;
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
    };
}

export function CountdownSection({ targetDate = '2027-05-12T09:30:00' }: CountdownSectionProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const initTimer = setTimeout(() => {
            setIsMounted(true);
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 0);

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 60_000);

        return () => {
            clearTimeout(initTimer);
            clearInterval(interval);
        };
    }, [targetDate]);

    const showPassed = isMounted && timeLeft === null;
    const currentUnits = timeLeft || { days: 0, hours: 0, minutes: 0 };

    const eventDate = new Date(targetDate);
    const formattedDate = eventDate.toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <section className="relative bg-white" aria-label="Countdown zur Unternehmerbörse" data-navbar="light">

            <div
                className="h-2 w-full absolute top-0 left-0"
                style={{
                    background:
                        'linear-gradient(90deg, #0D1117 0%, #FE3D4E 72%, #FE3D4E 100%)',
                }}
                aria-hidden="true"
            />

            <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-24 md:py-36 text-center flex flex-col items-center">
                {/* Heading */}
                <p tabIndex={0} className="text-[#0D1117] text-lg md:text-xl font-bold tracking-wide uppercase focus-ring rounded inline-block px-2">
                    Sei dabei am
                </p>

                <p tabIndex={0} className="mt-3 text-[#962831] text-5xl md:text-7xl lg:text-8xl font-black leading-none rounded-xl inline-block px-4 py-2 focus-ring">
                    {formattedDate.replace(/\./g, '. ')}
                </p>

                {showPassed ? (
                    <div className="mt-12">
                        <p className="text-[#0D1117]/70 text-lg font-medium rounded-lg p-2 inline-block">
                            Die Unternehmerbörse hat erfolgreich stattgefunden.
                        </p>
                    </div>
                ) : (
                    <div
                        className="flex justify-center items-center gap-8 md:gap-14 mt-16 pb-12"
                        role="timer"
                        aria-live="off"
                        aria-label={isMounted && timeLeft ? `Noch ${timeLeft.days} Tage, ${timeLeft.hours} Stunden und ${timeLeft.minutes} Minuten` : 'Berechne verbleibende Zeit...'}
                    >
                        <CountdownUnit value={currentUnits.days} label="Tage" />
                        <span className="text-4xl md:text-6xl text-[#0D1117]/60 font-black leading-none animate-pulse-fast select-none" aria-hidden="true">:</span>
                        <CountdownUnit value={currentUnits.hours} label="Stunden" />
                        <span className="text-4xl md:text-6xl text-[#0D1117]/60 font-black leading-none animate-pulse-fast select-none" aria-hidden="true">:</span>
                        <CountdownUnit value={currentUnits.minutes} label="Minuten" />
                    </div>
                )}
            </div>

            <div
                className="h-2 w-full absolute bottom-0 left-0"
                style={{
                    background:
                        'linear-gradient(90deg, #FE3D4E 0%, #FE3D4E 28%, #0D1117 100%)',
                }}
                aria-hidden="true"
            />


        </section>
    );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <div tabIndex={0} className="relative text-center rounded-xl p-3 focus-ring flex flex-col items-center" aria-label={`${value} ${label}`}>
            <div className="text-5xl md:text-7xl lg:text-8xl font-black text-[#0D1117] leading-none tabular-nums">
                {String(value).padStart(2, '0')}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 text-xs md:text-sm font-bold uppercase tracking-widest text-[#0D1117]/70 mt-2 whitespace-nowrap">
                {label}
            </div>
        </div>
    );
}