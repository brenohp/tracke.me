// Caminho: src/app/[subdomain]/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import { DashboardShell } from './_components/DashboardShell';
import prisma from '@/lib/prisma';

export interface PlanPermissions {
  hasPackages?: boolean;
  hasBilling?: boolean;
  hasInventory?: boolean;
  hasAutomation?: boolean;
  hasMarketing?: boolean;
  hasReports?: boolean;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // CORRETO: await é necessário para cookies()
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;

  // CORRETO: await é necessário para a nossa nova verifyToken()
  const session = await verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'ADMIN') {
    redirect('/admin');
  }

  let permissions: PlanPermissions = {};
  
  try {
    const businessWithPlan = await prisma.business.findUnique({
      where: { id: session.businessId },
      select: {
        plan: {
          select: { permissions: true }
        }
      }
    });

    if (businessWithPlan?.plan?.permissions) {
      permissions = businessWithPlan.plan.permissions as PlanPermissions;
    }
  } catch (error) {
    console.error("Falha ao buscar permissões do plano:", error);
  }

  return (
    <DashboardShell permissions={permissions}>
      {children}
    </DashboardShell>
  );
}