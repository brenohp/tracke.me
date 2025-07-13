// Caminho: src/app/[subdomain]/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import { DashboardShell } from './_components/DashboardShell';

export default async function DashboardLayout({ // Adicionado 'async'
  children,
}: {
  children: React.ReactNode;
}) {
  // CORREÇÃO: Adicionado 'await'
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'ADMIN') {
    redirect('/admin');
  }

  return <DashboardShell>{children}</DashboardShell>;
}