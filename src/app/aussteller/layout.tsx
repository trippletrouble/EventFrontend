import React from 'react';

export const metadata = {
  title: 'Aussteller | Unternehmerbörse 2026',
  description: 'Übersicht über alle Partner und Aussteller der Unternehmerbörse 2026 an der Hochschule Hof.',
};

export default function ExhibitorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}
