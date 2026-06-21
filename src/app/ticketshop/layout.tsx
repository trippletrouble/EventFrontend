'use client';

import React from 'react';
import Header from "@/components/Layout/Header";

export default function TicketshopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans flex flex-col">
      <Header />
      <div className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
    </div>
  );
}