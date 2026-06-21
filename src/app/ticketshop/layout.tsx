'use client';

import React, { useEffect } from 'react';
import Header from "@/components/Layout/Header";
import { HeroSection } from "@/components/Landing/HeroSection";

export default function TicketshopLayout({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        const pronounElement = document.querySelector('.tracking-wide.whitespace-nowrap');
        if (pronounElement) pronounElement.textContent = 'Ihre';

        const allSpans = document.querySelectorAll('h2.uppercase span');

        allSpans.forEach((span) => {
            const innerSpan = span.querySelector('span') || span;
            const text = innerSpan.textContent?.trim();

            if (text === 'ZUKUNFT.') {
                innerSpan.textContent = 'SICHTBARKEIT.';
            } else if (text === 'CHANCE.') {
                innerSpan.textContent = 'TALENTE.';
            } else if (text === 'KARRIERE.') {
                innerSpan.textContent = 'REICHWEITE.';
            }
        });
    }, []);

    return (
        <div className="bg-[#0D1117] text-white py-16 md:py-24 min-h-screen font-sans">

            <Header/>
            <HeroSection/>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
                <section
                    id="main-content"
                    role="region"
                    tabIndex={-1}
                    aria-label="Ticketshop Formularbereich"
                    className="focus:outline-none"
                >
                    {children}
                </section>
            </div>
        </div>
    );
}