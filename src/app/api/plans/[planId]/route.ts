// src/app/api/plans/[planId]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathnameParts = url.pathname.split('/');
    const planId = pathnameParts[pathnameParts.length - 1];

    if (!planId) {
      return NextResponse.json({ message: 'O ID do plano é obrigatório.' }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: {
        id: planId,
        active: true,
      },
      // ==========================================================
      // ALTERAÇÃO APLICADA AQUI
      // ==========================================================
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        features: true, // 1. Incluímos o campo 'features' na busca
      }
    });

    if (!plan) {
      return NextResponse.json({ message: 'Plano não encontrado ou inativo.' }, { status: 404 });
    }

    const serializedPlan = {
      ...plan,
      price: plan.price.toString(),
      // 2. Garantimos que o campo 'features' seja enviado como uma string JSON
      features: JSON.stringify(plan.features),
    };

    return NextResponse.json(serializedPlan);

  } catch (error) {
    console.error('[API_PLAN_GET_BY_ID_ERROR]', error);
    return NextResponse.json({ message: 'Erro interno ao buscar o plano.' }, { status: 500 });
  }
}