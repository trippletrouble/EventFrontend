'use client';

import React, { useState } from 'react';
import type { CompanyDto, UpdateCompanyRequestDto } from '@/types/api.types';
import { CompanyForm } from '@/components/Company/CompanyForm';


// Mock initial company data matching CompanyDto
const mockCompany: CompanyDto = {
  companyId: 42,
  name: 'Hochschule Hof e.V. Partner',
  email: 'partner@hof-university.de',
  address: 'Alfons-Goppel-Platz 1',
  zip: '95028',
  city: 'Hof',
  status: 'VERIFIED',
  isSponsor: true,
};


export default function CompanyEditTestPage() {
  const [currentCompany, setCurrentCompany] = useState<CompanyDto>(mockCompany);
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setActionLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)]);
  };

  const handleUpdate = async (patchData: UpdateCompanyRequestDto) => {
    setIsSimulatingApi(true);
    addLog('Formular übermittelt. Starte optimistisches UI-Update...');

    // 1. Save original state for rollback
    const originalCompany = { ...currentCompany };

    // 2. Perform optimistic update
    const optimisticCompany: CompanyDto = {
      ...currentCompany,
      name: patchData.name ?? currentCompany.name,
      email: patchData.email ?? currentCompany.email,
      address: patchData.address ?? currentCompany.address,
      zip: patchData.zip ?? currentCompany.zip,
      city: patchData.city ?? currentCompany.city,
    };
    setCurrentCompany(optimisticCompany);
    addLog(`Optimistisches Update durchgeführt: ${optimisticCompany.name}`);

    // 3. Simulate API call
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (simulateFailure) {
            reject(new Error('Netzwerk-Timeout: Verbindung zum API-Server fehlgeschlagen (Simuliert).'));
          } else {
            resolve();
          }
        }, 1500); // 1.5 second latency
      });

      // Succeeded
      addLog('API PATCH-Request erfolgreich abgeschlossen.');
    } catch (err) {
      // Revert/Rollback on failure
      const errorMsg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      addLog(`API PATCH-Request fehlgeschlagen! Rollback zu vorherigen Werten.`);
      setCurrentCompany(originalCompany);
      throw new Error(errorMsg);
    } finally {
      setIsSimulatingApi(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface p-6 md:p-12 text-foreground space-y-10 max-w-5xl mx-auto">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
          US-A3.3: Company Profile Form Test
        </h1>
        <p className="text-base md:text-lg text-foreground-muted max-w-3xl leading-relaxed">
          Verwenden Sie diese Seite, um die Validierung, Barrierefreiheit (WCAG 2.1 AA) und das optimistische UI-Update inklusive Rollback-Verhalten der Firmenprofil-Bearbeitung zu testen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Simulated UI status and logs */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface-raised border border-surface-border rounded-xl p-6 space-y-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-muted border-b border-surface-border pb-3">
              Aktueller UI-Zustand (State)
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex flex-col pb-2 border-b border-surface-border/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Firmenname</span>
                <span className="font-medium text-foreground mt-0.5">{currentCompany.name}</span>
              </div>
              <div className="flex flex-col pb-2 border-b border-surface-border/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">E-Mail-Adresse</span>
                <span className="font-medium text-foreground mt-0.5 break-all">{currentCompany.email}</span>
              </div>
              <div className="flex flex-col pb-2 border-b border-surface-border/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Adresse</span>
                <span className="font-medium text-foreground mt-0.5">{currentCompany.address}</span>
              </div>
              <div className="flex flex-col pb-2 border-b border-surface-border/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">PLZ & Ort</span>
                <span className="font-medium text-foreground mt-0.5">{currentCompany.zip} {currentCompany.city}</span>
              </div>
              <div className="flex flex-col pb-2 border-b border-surface-border/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Status</span>
                <span className="font-medium text-accent mt-0.5 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  {currentCompany.status}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Sponsor-Status</span>
                <span className="font-medium text-foreground mt-0.5">{currentCompany.isSponsor ? 'Ja' : 'Nein'}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-raised border border-surface-border rounded-xl p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-muted border-b border-surface-border pb-3">
              API-Simulation Steuerung
            </h3>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-surface-border bg-black text-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
              />
              <span className="text-sm font-semibold text-foreground">API-Fehler simulieren</span>
            </label>
            <p className="text-xs leading-relaxed text-foreground-muted/85">
              Wenn aktiviert, schlägt die API-Übermittlung nach 1,5 Sekunden fehl und die UI rollt sich automatisch auf die alten Werte zurück.
            </p>
          </div>

          <div className="bg-surface-raised border border-surface-border rounded-xl p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-muted border-b border-surface-border pb-3">
              Aktions-Protokoll (Log)
            </h3>
            <div className="text-[11px] font-mono max-h-36 overflow-y-auto space-y-2 text-foreground-muted/90 scrollbar-thin">
              {actionLog.length === 0 && <p className="italic text-foreground-muted/50">Keine Aktionen protokolliert.</p>}
              {actionLog.map((log, idx) => (
                <p key={idx} className={log.includes('fehlgeschlagen') ? 'text-destructive' : log.includes('erfolgreich') ? 'text-accent' : ''}>
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: The CompanyForm component */}
        <div className="md:col-span-2">
          <CompanyForm
            company={currentCompany}
            onSubmit={handleUpdate}
            isLoading={isSimulatingApi}
          />
        </div>
      </div>
    </main>
  );
}
