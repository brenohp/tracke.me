// Caminho: src/app/api/admin/coupons/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para ATUALIZAR (EDITAR) um cupão
export async function PUT(
  request: Request,
  context: { params: { id: string } } // ASSINATURA CORRIGIDA
) {
  const { id: couponId } = context.params; // ID pego do 'context'
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { code, discountType, discountValue, expiresAt, active } = body;

    if (!code || !discountType) {
      return NextResponse.json({ message: 'Código e tipo de desconto são obrigatórios.' }, { status: 400 });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active,
      },
    });

    revalidatePath('/admin/coupons');
    return NextResponse.json(updatedCoupon, { status: 200 });

  } catch (error) {
    console.error(`Erro ao atualizar cupão ${couponId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para EXCLUIR um cupão
export async function DELETE(
  request: Request, // O primeiro parâmetro é necessário
  context: { params: { id: string } } // ASSINATURA CORRIGIDA
) {
  const { id: couponId } = context.params; // ID pego do 'context'
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    await prisma.coupon.delete({
      where: { id: couponId },
    });

    revalidatePath('/admin/coupons');
    return NextResponse.json({ message: 'Cupão excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao excluir cupão ${couponId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}