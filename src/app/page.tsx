import React from 'react';
import Header from '@/components/Layout/Header';
import { HeroSection } from '@/components/Landing/HeroSection';
import { CarouselSection } from '@/components/Landing/CarouselSection';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <CarouselSection />
      </main>
    </>
  );
}