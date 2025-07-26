// Caminho: src/app/[subdomain]/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import { DashboardShell } from './_components/DashboardShell';
import prisma from '@/lib/prisma'; // 1. Importar o Prisma

// Definindo a estrutura das permissões que esperamos
export interface PlanPermissions {
  hasPackages?: boolean;
  hasBilling?: boolean;
  hasInventory?: boolean;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'ADMIN') {
    redirect('/admin');
  }

  // ===================================================================
  // 2. BUSCAR AS PERMISSÕES DO PLANO DO USUÁRIO
  // ===================================================================
  let permissions: PlanPermissions = {}; // Permissões padrão: nenhuma
  
  try {
    const businessWithPlan = await prisma.business.findUnique({
      where: { id: session.businessId },
      select: {
        plan: {
          select: { permissions: true } // Buscando o novo campo 'permissions'
        }
      }
    });

    if (businessWithPlan?.plan?.permissions) {
      permissions = businessWithPlan.plan.permissions as PlanPermissions;
    }
  } catch (error) {
    console.error("Falha ao buscar permissões do plano:", error);
  }
  // ===================================================================

  return (
    // 3. Passar as permissões para o componente de cliente
    <DashboardShell permissions={permissions}>
      {children}
    </DashboardShell>
  );
}