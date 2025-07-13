// Caminho: src/app/[subdomain]/dashboard/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import DashboardClientView from './_components/DashboardClientView'; // 1. Importa o novo componente

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session) {
    redirect('/login');
  }

  // A página do servidor ainda busca o nome do usuário para a mensagem de boas-vindas
  const user = await prisma.user.findUnique({ 
    where: { id: session.userId },
    select: { name: true }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary">
        Bem-vindo, {user?.name.split(' ')[0]}!
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Aqui está um resumo do seu negócio.
      </p>

      {/* 2. Renderiza o componente de cliente que contém toda a lógica interativa */}
      <div className="mt-8">
        <DashboardClientView />
      </div>
    </div>
  );
}