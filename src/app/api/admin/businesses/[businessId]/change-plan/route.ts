// Caminho: src/app/api/admin/businesses/[businessId]/change-plan/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// A função agora recebe apenas 'request'.
export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  // Extraindo o businessId manualmente da URL da requisição
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  // Pega a parte da URL que vem depois de '/businesses/'
  const businessId = pathnameParts[pathnameParts.indexOf('businesses') + 1];

  if (!businessId) {
    return NextResponse.json({ message: 'ID do negócio não encontrado na URL.' }, { status: 400 });
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