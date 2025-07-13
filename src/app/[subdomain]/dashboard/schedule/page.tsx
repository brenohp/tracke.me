// Caminho: src/app/[subdomain]/dashboard/schedule/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import ScheduleView from './_components/ScheduleView'; // Nome do componente em inglês

// Função para buscar todos os dados necessários para o agendamento
async function getAppointmentData(businessId: string) {
  const [services, clients, professionals] = await Promise.all([
    prisma.service.findMany({
      where: { businessId, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    }),
    prisma.client.findMany({
      where: { businessId },
      orderBy: { name: 'asc' },
    }),
    prisma.user.findMany({
      where: {
        businessId,
        role: { in: ['OWNER', 'EMPLOYEE'] },
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);
  
  return { services, clients, professionals };
}

export default async function SchedulePage() { // Nome da página em inglês
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const { services, clients, professionals } = await getAppointmentData(session.businessId);

  // Converte os dados para um formato simples (serializável)
  const serializableServices = services.map(service => ({
    ...service,
    price: service.price.toString(),
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  }));

  const serializableClients = clients.map(client => ({
    ...client,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  }));

  // A página renderiza o componente de cliente, passando todos os dados necessários
  return (
    <ScheduleView 
      services={serializableServices}
      clients={serializableClients}
      professionals={professionals}
    />
  );
}