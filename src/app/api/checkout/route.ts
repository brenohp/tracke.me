// src/app/api/checkout/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://lvh.me:3000';

export async function POST(request: Request) {
  try {
    // 1. Recebe os dados do formulário de cadastro do frontend
    const body = await request.json();
    const { 
      planId, 
      userName, 
      userEmail, 
      userPassword,
      businessName,
      businessSubdomain,
    } = body;

    if (!planId || !userName || !userEmail || !userPassword || !businessName || !businessSubdomain) {
      return NextResponse.json({ success: false, message: 'Dados do formulário estão incompletos.' }, { status: 400 });
    }

    // 2. Busca o plano no nosso banco de dados para encontrar o ID de preço da Stripe
    const plan = await prisma.plan.findUnique({ where: { id: planId } });

    if (!plan || !plan.stripePriceId) {
      return NextResponse.json({ success: false, message: 'Plano ou ID de preço da Stripe não encontrado.' }, { status: 404 });
    }

    // 3. Cria a Sessão de Checkout na Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription', // Define o modo como assinatura
      payment_method_types: ['card'],
      
      line_items: [
        {
          price: plan.stripePriceId, // Usa o ID do preço que buscamos no nosso banco
          quantity: 1,
        },
      ],
      
      // URLs para onde a Stripe redirecionará o usuário
      success_url: `${APP_URL}/register/success`,
      cancel_url: `${APP_URL}/register?planId=${plan.id}`,
      
      // 4. Anexa os dados de cadastro do usuário como metadados
      // Isso é crucial para que o nosso webhook saiba qual conta criar depois
      metadata: {
        planId: plan.id,
        userName,
        userEmail,
        userPassword,
        businessName,
        businessSubdomain,
      }
    });

    // 5. Devolve o ID da Sessão para o frontend
    return NextResponse.json({ success: true, sessionId: checkoutSession.id });

  } catch (error: unknown) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ success: false, message: 'Erro ao criar a sessão de checkout.', details: errorMessage }, { status: 500 });
  }
}