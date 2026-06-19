import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Firmenprofil ${id} – Unternehmerbörse 2026`,
    description: `Firmenprofil und Buchungsstatus für Unternehmen ${id}.`,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { id } = await params;

  return (
    <main id="main-content" className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Firmenprofil</h1>
      <p className="text-foreground-muted text-sm mt-1">Unternehmen {id}</p>
    </main>
  );
}
