// Caminho: src/app/api/admin/plans/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para LISTAR todos os planos (Apenas para ADMIN)
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

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

// Função para CRIAR um novo plano (Apenas para ADMIN)
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price, features, active } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ message: 'Nome e preço são obrigatórios.' }, { status: 400 });
    }

    const newPlan = await prisma.plan.create({
      data: {
        name,
        description,
        price,
        features,
        active,
      },
    });
    
    // Invalida o cache da página de planos para que a lista seja atualizada
    revalidatePath('/admin/plans');

    return NextResponse.json(newPlan, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar plano (admin):', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}