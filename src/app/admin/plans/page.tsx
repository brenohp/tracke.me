// Caminho: src/app/admin/plans/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import PlansView from './_components/PlansView'; // Vamos criar este ficheiro a seguir

// Função para buscar os dados de todos os planos no servidor
async function getPlansData() {
  const plans = await prisma.plan.findMany({
    orderBy: {
      price: 'asc', // Ordena do mais barato para o mais caro
    },
  });
  
  return plans;
}

export default async function AdminPlansPage() {
  // Segurança em camadas
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
    // Converte o campo Json para uma string para passar ao cliente
    features: JSON.stringify(plan.features), 
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  }));

  return <PlansView plans={serializablePlans} />;
}