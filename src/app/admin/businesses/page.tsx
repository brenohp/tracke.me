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
    include: {
      plan: { 
        select: {
          id: true, // Incluímos o ID do plano atual
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

// ===================================================================
// 1. NOVA FUNÇÃO PARA BUSCAR TODOS OS PLANOS DISPONÍVEIS
// ===================================================================
async function getAvailablePlans() {
  const plans = await prisma.plan.findMany({
    where: { active: true }, // Buscamos apenas planos ativos para seleção
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc'
    }
  });
  return plans;
}


export default async function AdminBusinessesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  // 2. Chamamos ambas as funções de busca de dados em paralelo
  const [businesses, availablePlans] = await Promise.all([
    getBusinessesData(),
    getAvailablePlans(),
  ]);

  // Converte os dados de negócios para um formato simples (serializável)
  const serializableBusinesses = businesses.map(business => ({
    ...business,
    createdAt: business.createdAt.toISOString(),
    updatedAt: business.updatedAt.toISOString(),
  }));

  // A lista de planos (availablePlans) já é serializável (contém apenas id e nome)

  return (
    // 3. Passamos ambas as listas para o componente de cliente
    <BusinessesView 
      businesses={serializableBusinesses} 
      allPlans={availablePlans} 
    />
  );
}