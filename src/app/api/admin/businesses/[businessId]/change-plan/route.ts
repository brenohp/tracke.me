// Caminho: src/app/api/admin/businesses/[businessId]/change-plan/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// ASSINATURA DA FUNÇÃO CORRIGIDA
export async function PUT(
  request: Request,
  context: { params: { businessId: string } }
) {
  // O ID é pego de dentro do 'context.params'
  const { businessId } = context.params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const { newPlanId } = await request.json();

    if (!newPlanId) {
      return NextResponse.json({ message: 'O ID do novo plano é obrigatório.' }, { status: 400 });
    }

    await prisma.business.update({
      where: { id: businessId },
      data: {
        planId: newPlanId,
      },
    });

    revalidatePath('/admin/businesses');

    return NextResponse.json({ message: 'Plano do negócio atualizado com sucesso.' }, { status: 200 });

  } catch (error) {
    console.error(`Erro ao alterar plano para o negócio ${businessId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}