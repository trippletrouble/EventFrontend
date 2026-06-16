'use client';

import React, { useState } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { TierList } from '@/components/Ticketshop/TierList';
import { Alert } from '@/components/UI';

export default function TicketshopPage() {
  const { tiers, isLoading, error } = useTiers(1);
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);

  const handleSelectTier = (id: number) => {
    setSelectedTierId(id);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Paketauswahl (Ticketshop)</h1>
      <p className="text-foreground-muted text-sm">
        Wählen Sie das passende Standpaket für Ihr Unternehmen aus.
      </p>

      {error && (
        <Alert variant="error" title="Fehler">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8" aria-label="Pakete laden">
          <svg className="h-10 w-10 animate-spin text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <TierList
          tiers={tiers}
          isSponsor={false}
          selectedTierId={selectedTierId}
          onSelect={handleSelectTier}
        />
      )}
    </main>
  );
}
