// src/app/dashboard/page.tsx

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

// A lógica de busca de dados agora está diretamente no componente da página
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const session = verifyToken(token);
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    include: {
      business: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary">
        Bem-vindo, {user.name.split(' ')[0]}!
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Este é o painel de controle do seu negócio: <span className="font-semibold text-brand-accent">{user.business.name}</span>.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards de Exemplo para o Futuro */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-brand-primary">Próximos Agendamentos</h3>
          <p className="mt-2 text-gray-500">Ainda não há agendamentos para hoje.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-brand-primary">Total de Clientes</h3>
          <p className="mt-2 text-5xl font-bold text-brand-accent">0</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-brand-primary">Serviços Ativos</h3>
          <p className="mt-2 text-5xl font-bold text-brand-accent">0</p>
        </div>
      </div>
    </div>
  );
}