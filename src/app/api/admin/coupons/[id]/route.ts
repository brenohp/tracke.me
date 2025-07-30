// Caminho: src/app/api/admin/coupons/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para ATUALIZAR (EDITAR) um cupom
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const couponId = pathnameParts[pathnameParts.indexOf('coupons') + 1];

  // CORREÇÃO: Adicionado 'await'
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
    console.error(`Erro ao atualizar cupom ${couponId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para EXCLUIR um cupom
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const couponId = pathnameParts[pathnameParts.indexOf('coupons') + 1];

  // CORREÇÃO: Adicionado 'await'
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
    return NextResponse.json({ message: 'Cupom excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao excluir cupom ${couponId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}