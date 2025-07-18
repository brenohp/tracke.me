// Caminho: src/app/api/admin/coupons/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // 1. CORREÇÃO: Importa os tipos do local correto
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para LISTAR todos os cupões (Apenas para ADMIN)
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

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

// Função para CRIAR um novo cupão (Apenas para ADMIN)
export async function POST(request: Request) {
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

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active,
      },
    });

    revalidatePath('/admin/coupons');

    return NextResponse.json(newCoupon, { status: 201 });

  } catch (error: unknown) { // 2. CORREÇÃO: Tratamento de erro de tipo seguro
    console.error('Erro ao criar cupão (admin):', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ message: 'Este código de cupão já está em uso.' }, { status: 409 });
      }
    }
    
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}