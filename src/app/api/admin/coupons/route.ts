// Caminho: src/app/api/admin/coupons/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe'; // <-- IMPORTAÇÃO ADICIONADA AQUI

// A função GET para listar os cupons continua a mesma.
export async function GET() {
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

// Função POST para criar cupons, agora sincronizada com a Stripe
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

    // Prepara os dados para a API da Stripe
    const stripeCouponData: Stripe.CouponCreateParams = {
      name: code.toUpperCase(),
      duration: 'once', 
    };

    if (discountType === 'PERCENTAGE') {
      stripeCouponData.percent_off = Number(discountValue);
    } else if (discountType === 'FIXED') {
      stripeCouponData.amount_off = Number(discountValue) * 100; // Stripe usa centavos
      stripeCouponData.currency = 'brl';
    }

    // Cria o cupom primeiro na Stripe
    const stripeCoupon = await stripe.coupons.create(stripeCouponData);

    // Se a criação na Stripe deu certo, salva no nosso banco de dados
    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
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
    
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}