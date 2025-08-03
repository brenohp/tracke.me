// Caminho CORRETO: src/app/[subdomain]/dashboard/clientes/page.tsx

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ClientsClientView from './_components/ClientsClientView';

// Função para buscar os dados dos clientes no servidor
async function getClientsData(businessId: string) {
  const clients = await prisma.client.findMany({
    where: { businessId },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      observations: true,
      businessId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { name: 'asc' },
  });
  
  return clients;
}

export default async function ClientsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  // --- CORREÇÃO: Adicionado 'await' ---
  const session = await verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  const clients = await getClientsData(session.businessId);

  // Converte os dados para um formato simples (serializável)
  const serializableClients = clients.map(client => ({
    ...client,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  }));

  // A página apenas renderiza o componente de cliente, passando os dados
  return <ClientsClientView clients={serializableClients} />;
}