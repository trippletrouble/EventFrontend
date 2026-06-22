import React from 'react';

export function CTABanner() {
    return (
        <div className="w-full">
            {/* Übergangs-Streifen oben */}
            <div
                className="h-2 w-full stripe-reveal bg-[linear-gradient(90deg,#000_0%,#000_27.88%,#0AD88E_100%)]"
                aria-hidden="true"
            />

            <section className="py-16 md:py-20 bg-[#0AD88E]" data-navbar="light">
                <div className="container mx-auto px-4 text-center flex flex-col items-center justify-center">
                    <h2 tabIndex={0} className="text-[45px] font-extrabold leading-[45px] text-black focus-ring rounded inline-block px-2">
                        Werden Sie Aussteller.
                    </h2>
                    <a href="/ticketshop"
                       className="inline-block mt-8 bg-black text-white font-extrabold text-[15px] leading-[45px] px-16 rounded-[10px] hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black">
                        Stand buchen →
                    </a>
                </div>
            </section>

            {/* Übergangs-Streifen unten */}
            <div
                className="h-2 w-full stripe-reveal bg-[linear-gradient(90deg,#0AD88E_0%,#000000_73%,#000000_100%)]"
                aria-hidden="true"
            />
        </div>
    );
}