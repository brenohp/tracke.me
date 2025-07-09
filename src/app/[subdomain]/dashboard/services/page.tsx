// Caminho: src/app/[subdomain]/dashboard/servicos/page.tsx

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ServicesClientView from './_components/ServicesClientView';

// Função para buscar os dados no servidor
async function getServicesData(businessId: string) {
  const [services, professionals] = await Promise.all([
    prisma.service.findMany({
      where: { businessId },
      include: {
        professionals: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      where: {
        businessId,
        role: { in: ['OWNER', 'EMPLOYEE'] }
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
  ]);
  
  return { services, professionals };
}

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const { services, professionals } = await getServicesData(session.businessId);

  // Converte os dados para um formato simples (serializável)
  const serializableServices = services.map(service => ({
    ...service,
    price: service.price.toString(),
    status: service.status, // Garante que o status é incluído
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  }));

  // Passa os dados já convertidos para o componente de cliente
  return <ServicesClientView services={serializableServices} professionals={professionals} />;
}