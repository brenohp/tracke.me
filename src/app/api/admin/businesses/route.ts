// Caminho: src/app/api/admin/businesses/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

// Função para LISTAR todos os negócios na plataforma (Apenas para ADMIN)
export async function GET() {
  // 1. Autenticação e Autorização
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  // Garante que apenas um ADMIN pode aceder a esta rota
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    // 2. Busca todos os negócios no banco de dados
    const businesses = await prisma.business.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // Inclui a contagem de usuários para sabermos o tamanho da equipe
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return NextResponse.json(businesses, { status: 200 });

  } catch (error) {
    console.error('Erro ao listar negócios (admin):', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}