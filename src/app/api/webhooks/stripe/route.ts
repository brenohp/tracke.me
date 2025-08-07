// src/app/api/webhooks/stripe/route.ts

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const body = await request.text();
  const headerPayload = await headers();
  const signature = headerPayload.get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error(`❌ Erro na verificação do Webhook: ${error.message}`);
      return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    } else {
      console.error('❌ Erro desconhecido na verificação do Webhook');
      return NextResponse.json({ error: 'Webhook Error: Ocorreu um erro desconhecido' }, { status: 400 });
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('✅ Evento checkout.session.completed recebido!');

    // ==========================================================
    // CORREÇÃO APLICADA AQUI
    // ==========================================================
    const customer = session.customer;
    let stripeCustomerId: string | undefined;

    // 1. Verificamos o tipo de 'customer'
    if (typeof customer === 'string') {
      stripeCustomerId = customer;
    } else if (customer && typeof customer === 'object' && 'id' in customer) {
      stripeCustomerId = customer.id;
    }

    const { 
      userName, 
      userEmail, 
      userPassword, 
      businessName, 
      businessSubdomain, 
      planId 
    } = session.metadata || {};

    if (!stripeCustomerId || !userName || !userEmail || !userPassword || !businessName || !businessSubdomain || !planId) {
      console.error('❌ Metadados ou stripeCustomerId ausentes na sessão de checkout.');
      return NextResponse.json({ error: 'Dados essenciais ausentes na sessão.' }, { status: 400 });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (existingUser) {
        console.warn('⚠️ Tentativa de registro duplicado ignorada.');
        return NextResponse.json({ success: true, message: 'Usuário já existe.' });
      }

      const hashedPassword = await bcrypt.hash(userPassword, 10);
      await prisma.business.create({
        data: {
          name: businessName,
          subdomain: businessSubdomain,
          planId: planId,
          // 2. Usamos a variável corrigida
          stripeCustomerId: stripeCustomerId, 
          users: {
            create: {
              name: userName,
              email: userEmail,
              password: hashedPassword,
              role: 'OWNER',
            },
          },
        },
      });

      console.log(`✅ Negócio '${businessName}' e usuário '${userEmail}' criados com sucesso!`);

    } catch (dbError) {
      console.error('❌ Erro ao salvar no banco de dados:', dbError);
      return NextResponse.json({ error: 'Erro no banco de dados.' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}