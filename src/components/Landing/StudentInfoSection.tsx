import React from 'react';
import { Briefcase, Users, FileCheck, Smartphone } from 'lucide-react';
import { FeatureItem } from './FeatureItem';

export function StudentInfoSection() {
  return (
    <section
      id="student-info"
      aria-labelledby="student-info-heading"
      className="py-16 relative bg-white"
      data-navbar="light"
    >
      <div className="h-2 w-full absolute top-0 left-0 stripe-reveal" style={{
        background: 'linear-gradient(90deg, #FE3D4E 0%, #FE3D4E 28%, transparent 100%)'
      }} aria-hidden="true" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="student-info-heading" tabIndex={0} className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-12 focus-ring rounded inline-block mx-auto px-2">
          Infos für Studierende
        </h2>

        {/* Sub-Sektion: Karrierestart */}
        <div className="max-w-3xl mx-auto mb-12">
          <h3 tabIndex={0} className="text-xl font-bold text-slate-800 mb-6 focus-ring rounded inline-block px-1">Dein Karrierestart.</h3>

          <div className="space-y-6">
            <FeatureItem
              icon={<Briefcase className="w-[35px] h-[35px]" />}
              borderColorClass="border-[#9E7400]"
              iconColor="text-[#9E7400]"
              title="Jobs & Praktika"
              description="Finde deinen nächsten Karriereschritt ohne Umwege: Egal ob Praktikum, Werkstudentenjob oder der Direkteinstieg nach dem Studium."
              theme="light"
            />
            <FeatureItem
              icon={<Users className="w-[35px] h-[35px]" />}
              borderColorClass="border-[#2860F9]"
              iconColor="text-[#2860F9]"
              title="Networking"
              description="Nutze die Chance, mit über 80 Unternehmen aus allen Fachrichtungen in Kontakt zu treten und dein professionelles Netzwerk persönlich zu erweitern."
              theme="light"
            />
            <FeatureItem
              icon={<FileCheck className="w-[35px] h-[35px]" />}
              borderColorClass="border-[#FE3D4E]"
              iconColor="text-[#FE3D4E]"
              title="CV-Check"
              description="Lass deine Bewerbungsunterlagen direkt vor Ort von dem Career Service prüfen, um deine Erfolgschancen im Bewerbungsprozess zu steigern."
              theme="light"
            />
            <FeatureItem
              icon={<Smartphone className="w-[35px] h-[35px]" />}
              borderColorClass="border-[#068053]"
              iconColor="text-[#068053]"
              title="Messe-App"
              description="Filtere Aussteller nach deinen Interessen und plane deinen Messetag mit dem Raumplan und sieh dir die Ausstellerprofile an."
              theme="light"
            />
          </div>
        </div>

        {/* Sub-Sektion: Tipps */}
        <div className="max-w-3xl mx-auto">
          <h3 tabIndex={0} className="text-xl font-bold text-slate-800 mb-6 focus-ring rounded inline-block px-1">Tipps für deinen Messebesuch</h3>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 list-disc list-inside text-slate-700 text-sm md:text-base">
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Lebenslauf mitbringen</li>
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Messe App zur Orientierung</li>
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Fragen vorbereiten</li>
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Ausstellerliste ansehen</li>
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Gepflegte Kleidung</li>
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Wunschfirmen vorher raussuchen</li>
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Ordentliches Erscheinungsbild</li>
            <li tabIndex={0} className="px-2 py-1 focus-ring rounded">Früh kommen</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
