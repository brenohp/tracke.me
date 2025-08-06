// src/app/api/coupons/validate/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { couponCode } = body;

    if (!couponCode) {
      return NextResponse.json({ success: false, message: 'O código do cupom é obrigatório.' }, { status: 400 });
    }

    // 1. Busca o cupom no banco de dados pelo código
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: couponCode.toUpperCase(),
      },
    });

    // 2. Valida se o cupom existe, está ativo e não expirou
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Cupom inválido.' }, { status: 404 });
    }
    if (!coupon.active) {
      return NextResponse.json({ success: false, message: 'Este cupom não está mais ativo.' }, { status: 400 });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ success: false, message: 'Este cupom expirou.' }, { status: 400 });
    }

    // 3. Se o cupom for válido, retorna os detalhes do desconto
    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        // Converte o Decimal para string para ser enviado via JSON
        discountValue: coupon.discountValue ? coupon.discountValue.toString() : null,
      },
    });

  } catch (error) {
    console.error('[COUPON_VALIDATE_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}