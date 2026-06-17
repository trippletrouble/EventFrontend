import React from 'react';
import Header from '@/components/Layout/Header';
import { HeroSection } from '@/components/Landing/HeroSection';
import { CarouselSection } from '@/components/Landing/CarouselSection';
import { CountdownSection } from '@/components/Landing/CountdownSection';
import EventInfoSection from '@/components/Landing/EventInfoSection';
import { CTABanner } from '@/components/Landing/CTABanner';
import { StudentInfoSection } from '@/components/Landing/StudentInfoSection';
import TestimonialSection from '@/components/Landing/TestimonialSection';
import { FAQSection } from '@/components/Landing/FAQSection';
import { RevealOnScroll } from '@/components/Landing/RevealOnScroll';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <EventInfoSection />
        <CountdownSection />
        <CarouselSection />

        <StudentInfoSection />

        <RevealOnScroll>
          <FAQSection />
        </RevealOnScroll>

        <RevealOnScroll>
          <TestimonialSection />
        </RevealOnScroll>

        <CTABanner />
      </main>
    </>
  );
}