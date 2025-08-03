// Caminho: src/app/api/admin/plans/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função PUT (ATUALIZAR) com a nova lógica
export async function PUT(request: Request) {
  // Extrai o ID manualmente da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const planId = pathnameParts[pathnameParts.indexOf('plans') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price, features, permissions, active } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ message: 'Nome e preço são obrigatórios.' }, { status: 400 });
    }

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        name,
        description,
        price,
        features,
        permissions,
        active,
      },
    });

    revalidatePath('/admin/plans');
    revalidatePath('/');
    return NextResponse.json(updatedPlan, { status: 200 });

  } catch (error) {
    console.error(`Erro ao atualizar plano ${planId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função DELETE com a nova lógica
export async function DELETE(request: Request) {
  // Extrai o ID manualmente da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const planId = pathnameParts[pathnameParts.indexOf('plans') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    await prisma.plan.delete({
      where: { id: planId },
    });

    revalidatePath('/admin/plans');
    revalidatePath('/'); 
    return NextResponse.json({ message: 'Plano excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao excluir plano ${planId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}