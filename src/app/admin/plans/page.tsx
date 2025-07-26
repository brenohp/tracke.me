// Caminho: src/app/admin/plans/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import PlansView from './_components/PlansView';

// Função para buscar os dados de todos os planos no servidor
async function getPlansData() {
  const plans = await prisma.plan.findMany({
    orderBy: {
      price: 'asc',
    },
  });
  
  return plans;
}

export default async function AdminPlansPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const plans = await getPlansData();

  // Converte os dados para um formato simples (serializável)
  const serializablePlans = plans.map(plan => ({
    ...plan,
    price: plan.price.toString(),
    features: JSON.stringify(plan.features),
    // ===================================================================
    // ADICIONADO AQUI: Serializar o novo campo 'permissions'
    // ===================================================================
    permissions: JSON.stringify(plan.permissions),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  }));

  return <PlansView plans={serializablePlans} />;
}