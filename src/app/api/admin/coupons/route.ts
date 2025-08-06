// Caminho: src/app/api/admin/coupons/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// A função GET para listar os cupons continua a mesma.
export async function GET() {
  // ... (código inalterado)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(coupons, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar cupões (admin):', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função POST para criar cupons
export async function POST(request: Request) {
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

    const stripeCouponData: Stripe.CouponCreateParams = {
      name: code.toUpperCase(),
    };

    // ==========================================================
    // LÓGICA ATUALIZADA AQUI
    // ==========================================================
    if (discountType === 'PERCENTAGE') {
      stripeCouponData.percent_off = Number(discountValue);
    } else if (discountType === 'FIXED') {
      stripeCouponData.amount_off = Number(discountValue) * 100; // Stripe usa centavos
      stripeCouponData.currency = 'brl';
    } else if (discountType === 'FREE_TRIAL') {
      stripeCouponData.percent_off = 100; // 100% de desconto
      stripeCouponData.duration = 'once'; // Aplica o desconto apenas na primeira fatura
    }

    const stripeCoupon = await stripe.coupons.create(stripeCouponData);

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        // Para um free trial, o valor pode ser 0 ou nulo no nosso banco.
        discountValue: discountType === 'FREE_TRIAL' ? 0 : discountValue, 
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active,
        stripeCouponId: stripeCoupon.id, 
      },
    });

    revalidatePath('/admin/coupons');
    return NextResponse.json(newCoupon, { status: 201 });

  } catch (error: unknown) {
    console.error('Erro ao criar cupão (admin):', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ message: 'Este código de cupão já está em uso.' }, { status: 409 });
    }
    
    // Adicionando um tratamento de erro mais específico da Stripe
    if (error instanceof Stripe.errors.StripeError) {
        return NextResponse.json({ message: `Erro da Stripe: ${error.message}` }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}