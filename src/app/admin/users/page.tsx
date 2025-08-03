// Caminho CORRETO: src/app/admin/users/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import UsersView from './_components/UsersView'; // Importa a view que vamos criar/corrigir

// Função para buscar os dados de todos os usuários
async function getUsersData() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      business: {
        select: { name: true },
      },
    },
  });
  
  // Mapeia para um novo objeto explicitamente, sem o campo 'password'
  const usersToReturn = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessId: user.businessId,
    business: user.business,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return usersToReturn;
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const users = await getUsersData();

  // Converte as datas para um formato serializável
  const serializableUsers = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  // Passa os dados para o componente de cliente
  return <UsersView users={serializableUsers} />;
}