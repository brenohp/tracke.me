// Caminho: src/app/[subdomain]/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import { DashboardShell } from './_components/DashboardShell';
import prisma from '@/lib/prisma';
// A importação desnecessária do OnboardingGuide foi REMOVIDA daqui.

export interface PlanPermissions {
  hasPackages?: boolean;
  hasBilling?: boolean;
  hasInventory?: boolean;
  hasAutomation?: boolean;
  hasMarketing?: boolean;
  hasReports?: boolean;
}

interface UserData {
  email: string;
  emailVerified: Date | null;
}

interface OnboardingStatus {
  hasServices: boolean;
  hasClients: boolean;
  hasAvailability: boolean;
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
  let onboardingStatus: OnboardingStatus = {
    hasServices: false,
    hasClients: false,
    hasAvailability: false,
  };
  
  try {
    const userWithBusiness = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        email: true,
        emailVerified: true,
        business: {
          select: {
            plan: {
              select: { permissions: true }
            },
            _count: {
              select: {
                services: true,
                clients: true,
                users: {
                  where: { availabilities: { some: {} } }
                }
              }
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
      if (userWithBusiness.business?._count) {
        onboardingStatus = {
          hasServices: userWithBusiness.business._count.services > 0,
          hasClients: userWithBusiness.business._count.clients > 0,
          hasAvailability: userWithBusiness.business._count.users > 0,
        };
      }
    }
  } catch (error) {
    console.error("Falha ao buscar dados do usuário e do plano:", error);
  }

  if (!userData) {
    redirect('/login');
  }

  return (
    <DashboardShell permissions={permissions} user={userData} onboardingStatus={onboardingStatus}>
      {children}
    </DashboardShell>
  );
}