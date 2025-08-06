// Caminho: src/app/api/admin/coupons/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe'; // Importamos o cliente da Stripe

// A função PUT para ATUALIZAR continua a mesma por enquanto.
// (A atualização na Stripe é mais complexa, pois cupons são imutáveis)
export async function PUT(request: Request) {
    // ... seu código de PUT pode continuar aqui ...
    const url = new URL(request.url);
    const pathnameParts = url.pathname.split('/');
    const couponId = pathnameParts[pathnameParts.indexOf('coupons') + 1];

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const session = await verifyToken(token || '');

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

// Função DELETE para EXCLUIR, agora sincronizada com a Stripe
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const couponId = pathnameParts[pathnameParts.indexOf('coupons') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    // 1. Encontra o cupom no nosso banco para pegar o stripeCouponId
    const couponToDelete = await prisma.coupon.findUnique({
      where: { id: couponId },
    });

    // 2. Se ele tiver um ID da Stripe, deleta primeiro na Stripe
    if (couponToDelete && couponToDelete.stripeCouponId) {
      try {
        await stripe.coupons.del(couponToDelete.stripeCouponId);
      } catch (stripeError) {
        // Se o cupom não existir mais na Stripe, podemos ignorar o erro e continuar
        console.warn(`Erro ao deletar cupom na Stripe (pode já ter sido deletado):`, stripeError);
      }
    }

    // 3. Deleta o cupom do nosso banco de dados
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