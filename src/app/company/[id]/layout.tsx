import { requireAuth } from '@/app/lib/protect';
import { CompanyGuard } from '@/components/Auth/CompanyGuard';

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  return <CompanyGuard companyId={id}>{children}</CompanyGuard>;
}
