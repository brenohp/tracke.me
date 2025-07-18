// Caminho: src/app/admin/businesses/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import BusinessesView from './_components/BusinessesView';

// Função para buscar os dados de todos os negócios no servidor
async function getBusinessesData() {
  const businesses = await prisma.business.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    // CORREÇÃO: Incluímos os dados do plano relacionado
    include: {
      plan: { // Busca os dados do plano associado
        select: {
          name: true,
        }
      },
      _count: {
        select: { users: true },
      },
    },
  });
  
  return businesses;
}

export default async function AdminBusinessesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const businesses = await getBusinessesData();

  // Converte os dados para um formato simples (serializável)
  const serializableBusinesses = businesses.map(business => ({
    ...business,
    createdAt: business.createdAt.toISOString(),
    updatedAt: business.updatedAt.toISOString(),
  }));

  return <BusinessesView businesses={serializableBusinesses} />;
}