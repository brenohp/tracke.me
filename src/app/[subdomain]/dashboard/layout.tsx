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

// 1. Criamos uma interface para os dados do usuário que vamos buscar
interface UserData {
  email: string;
  emailVerified: Date | null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'ADMIN') {
    redirect('/admin');
  }

  let permissions: PlanPermissions = {};
  let userData: UserData | null = null;
  
  try {
    // 2. Buscamos os dados do plano e do usuário em uma única consulta
    const userWithBusiness = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        email: true,
        emailVerified: true,
        business: {
          select: {
            plan: {
              select: { permissions: true }
            }
          }
        }
      }
    });

    if (userWithBusiness) {
      userData = {
        email: userWithBusiness.email,
        emailVerified: userWithBusiness.emailVerified,
      };
      if (userWithBusiness.business?.plan?.permissions) {
        permissions = userWithBusiness.business.plan.permissions as PlanPermissions;
      }
    }
  } catch (error) {
    console.error("Falha ao buscar dados do usuário e do plano:", error);
  }

  if (!userData) {
    // Se não conseguirmos encontrar os dados do usuário, redirecionamos para o login como segurança
    redirect('/login');
  }

  return (
    // 3. Passamos os novos dados do usuário para o DashboardShell
    <DashboardShell permissions={permissions} user={userData}>
      {children}
    </DashboardShell>
  );
}