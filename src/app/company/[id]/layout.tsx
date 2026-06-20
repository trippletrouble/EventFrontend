import type { Metadata } from 'next';
// import { requireAuth } from '@/app/lib/protect';
import { CompanyGuard } from '@/components/Auth/CompanyGuard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Firmenprofil ${id} – Unternehmerbörse 2026`,
    description: `Firmenprofil und Buchungsstatus für Unternehmen ${id}.`,
  };
}

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // await requireAuth();
  const { id } = await params;

  return <CompanyGuard companyId={id}>{children}</CompanyGuard>;
}
