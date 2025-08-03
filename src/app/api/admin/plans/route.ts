// Caminho: src/app/api/admin/plans/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// A função GET não precisa de alterações
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        price: 'asc',
      },
    });
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar planos (admin):', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função POST (CRIAR) atualizada
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    // 1. Extrair o novo campo 'permissions' do corpo da requisição
    const { name, description, price, features, permissions, active } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ message: 'Nome e preço são obrigatórios.' }, { status: 400 });
    }

    const newPlan = await prisma.plan.create({
      data: {
        name,
        description,
        price,
        features,
        permissions, // 2. Adicionar 'permissions' aos dados a serem salvos
        active,
      },
    });
    
    revalidatePath('/admin/plans');
    revalidatePath('/');

    return NextResponse.json(newPlan, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar plano (admin):', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}