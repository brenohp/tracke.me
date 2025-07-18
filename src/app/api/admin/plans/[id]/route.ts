// Caminho: src/app/api/admin/plans/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para ATUALIZAR (EDITAR) um plano
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const planId = params.id;
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

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        name,
        description,
        price,
        features,
        active,
      },
    });

    revalidatePath('/admin/plans');
    return NextResponse.json(updatedPlan, { status: 200 });

  } catch (error) {
    console.error(`Erro ao atualizar plano ${planId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para EXCLUIR um plano
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const planId = params.id;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    // No futuro, podemos adicionar uma verificação para não deixar apagar um plano que tenha assinantes
    await prisma.plan.delete({
      where: { id: planId },
    });

    revalidatePath('/admin/plans');
    return NextResponse.json({ message: 'Plano excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao excluir plano ${planId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}