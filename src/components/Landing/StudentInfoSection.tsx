import React from 'react';
import { Briefcase, Users, FileCheck, Smartphone } from 'lucide-react';
import { FeatureItem } from './FeatureItem';
import { RevealOnScroll } from './RevealOnScroll';

export function StudentInfoSection() {
  return (
    <section
      id="student-info"
      aria-labelledby="student-info-heading"
      className="py-16 relative bg-white"
      data-navbar="light"
    >
      <div
        className="h-2 w-full absolute top-0 left-0 stripe-reveal bg-[linear-gradient(90deg,#0D1117_0%,#0D1117_28%,#2860F9_100%)]"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll rootMargin="0px 0px -20px 0px" threshold={0.05}>
          <h2
            id="student-info-heading"
            tabIndex={0}
            className="text-3xl md:text-[40px] font-extrabold text-center text-black mb-12 focus-ring rounded block mx-auto px-2"
          >
            Infos für Studierende
          </h2>
        </RevealOnScroll>

        {/* Sub-Sektion: Karrierestart */}
        <div className="max-w-3xl mx-auto mb-12">
          <RevealOnScroll rootMargin="0px 0px -20px 0px" threshold={0.05}>
            <h3
              tabIndex={0}
              className="text-xl md:text-2xl font-bold text-left text-black mb-4 focus-ring rounded inline-block px-1"
            >
              Dein Karrierestart.
            </h3>
          </RevealOnScroll>

          {/* Blaue Trennlinie */}
          <hr
            className="mb-8 border-t border-[#2860F9]"
            style={{ borderWidth: '1.5px' }}
            aria-hidden="true"
          />

          <RevealOnScroll rootMargin="0px 0px -20px 0px" threshold={0.05}>
            <div className="space-y-8">
              <FeatureItem
                icon={<Briefcase className="w-[35px] h-[35px]" />}
                borderColorClass="border-[transparent]"
                iconColor="text-[#9E7400]"
                title="Jobs & Praktika"
                description="Finde deinen nächsten Karriereschritt ohne Umwege: Egal ob Praktikum, Werkstudentenjob oder der Direkteinstieg nach dem Studium."
                theme="light"
              />
              <FeatureItem
                icon={<Users className="w-[35px] h-[35px]" />}
                borderColorClass="border-[transparent]"
                iconColor="text-[#2860F9]"
                title="Networking"
                description="Nutze die Chance, mit über 80 Unternehmen aus allen Fachrichtungen in Kontakt to treten und dein professionelles Netzwerk persönlich zu erweitern."
                theme="light"
              />
              <FeatureItem
                icon={<FileCheck className="w-[35px] h-[35px]" />}
                borderColorClass="border-[transparent]"
                iconColor="text-[#FE3D4E]"
                title="CV-Check"
                description="Lass deine Bewerbungsunterlagen direkt vor Ort von dem Career Service prüfen, um deine Erfolgschancen im Bewerbungsprozess zu steigern."
                theme="light"
              />
              <FeatureItem
                icon={<Smartphone className="w-[35px] h-[35px]" />}
                borderColorClass="border-[transparent]"
                iconColor="text-[#068053]"
                title="Messe-App"
                description="Filtere Aussteller nach deinen Interessen und plane deinen Messetag mit dem Raumplan und sieh dir die Ausstellerprofile an."
                theme="light"
              />
            </div>
          </RevealOnScroll>

          {/* Blaue Trennlinie */}
          <hr
            className="mt-8 mb-8 border-t border-[#2860F9]"
            style={{ borderWidth: '1.5px' }}
            aria-hidden="true"
          />
        </div>

        {/* Sub-Sektion: Tipps */}
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll rootMargin="0px 0px -20px 0px" threshold={0.05}>
            <h3
              tabIndex={0}
              className="text-xl md:text-2xl font-bold text-black mb-6 focus-ring rounded inline-block px-1"
            >
              Tipps für deinen Messebesuch
            </h3>
          </RevealOnScroll>

          <RevealOnScroll rootMargin="0px 0px -20px 0px" threshold={0.05}>
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 pl-6 mt-4 list-none"
              role="list"
              aria-label="Tipps für deinen Messebesuch"
            >
              {[
                'Lebenslauf mitbringen',
                'Messe App zur Orientierung',
                'Fragen vorbereiten',
                'Ausstellerliste ansehen',
                'Gepflegte Kleidung',
                'Wunschfirmen vorher raussuchen',
                'Ordentliches Erscheinungsbild',
                'Früh kommen'
              ].map((tip, idx) => (
                <li
                  key={idx}
                  className="relative pl-5 text-black text-sm md:text-base focus-ring rounded p-1 before:content-['•'] before:absolute before:left-1 before:text-black"
                  tabIndex={0}
                  role="listitem"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>

      <div
        className="h-2 w-full absolute bottom-0 left-0 stripe-reveal bg-[linear-gradient(90deg,#2860F9_0%,#0D1117_72%,#0D1117_100%)]"
        aria-hidden="true"
      />
    </section>
  );
}
