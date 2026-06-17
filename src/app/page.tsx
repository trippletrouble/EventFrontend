import React from 'react';
import Header from '@/components/Layout/Header';
import { CarouselSection } from '@/components/Landing/CarouselSection';
import {HeroSection} from "@/components/Landing/HeroSection";
import {CountdownSection} from "@/components/Landing/CountdownSection";
import EventInfoSection from "@/components/Landing/EventInfoSection";
import {CTABanner} from "@/components/Landing/CTABanner";

export default function LandingPage() {
  return (
    <>
      <Header />
        <HeroSection />
      <main id="main-content" className="flex-grow pt-20">
          <EventInfoSection />
          <CountdownSection />
        <CarouselSection />
          <CTABanner />
      </main>
    </>
  );
}