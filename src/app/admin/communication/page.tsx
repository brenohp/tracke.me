// Caminho: src/app/admin/communication/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { CommunicationView } from './_components/CommunicationView'; // Criaremos a seguir

// Função para buscar todos os planos ativos para o filtro
async function getPlans() {
  const plans = await prisma.plan.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  return plans;
}

export default async function AdminCommunicationPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const plans = await getPlans();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Comunicação com Clientes
        </h1>
        <p className="text-brand-accent mt-1">
          Envie atualizações e comunicados para todos os seus clientes ou para planos específicos.
        </p>
      </header>

      {/* Passamos a lista de planos para o componente de cliente */}
      <CommunicationView plans={plans} />
    </div>
  );
}