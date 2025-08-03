// Caminho: src/app/api/admin/users/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
// A importação do 'Prisma' foi removida.

// A função de busca de dados
async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      business: {
        select: {
          name: true,
        },
      },
    },
  });
  return users;
}

// 1. Usamos 'Awaited' e 'ReturnType' do TypeScript para extrair o tipo
type UserWithBusiness = Awaited<ReturnType<typeof getUsers>>[0];

// Função para LISTAR todos os usuários na plataforma (Apenas para ADMIN)
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const users = await getUsers();
    
    // Mapeia para um novo objeto explicitamente, sem o campo 'password'
    const usersToReturn = users.map((user: UserWithBusiness) => ({ // 2. O tipo agora está correto
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
        business: user.business,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));

    return NextResponse.json(usersToReturn, { status: 200 });

  } catch (error) {
    console.error('Erro ao listar usuários (admin):', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}