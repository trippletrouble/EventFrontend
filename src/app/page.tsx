import React from 'react';
import Header from '@/components/Layout/Header';
import { CarouselSection } from '@/components/Landing/CarouselSection';
import {StudentInfoSection} from "@/components/Landing/StudentInfoSection";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-grow pt-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-12">
          <h1 className="text-3xl font-bold text-foreground">Unternehmerbörse 2026</h1>
          <p className="mt-4 text-foreground-muted">Willkommen auf der Karrieremesse der Hochschule Hof.</p>
        </div>
        <CarouselSection />
          <StudentInfoSection />
      </main>
    </>
  );
}