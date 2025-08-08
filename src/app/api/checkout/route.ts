// src/app/api/checkout/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const APP_URL = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://lvh.me:3000';

// Função auxiliar para validar a força da senha
const isPasswordSecure = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasLetter && hasNumber;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      planId, 
      userName, 
      userEmail, 
      userPassword,
      businessName,
      businessSubdomain,
      couponCode,
    } = body;

    if (!planId || !userName || !userEmail || !userPassword || !businessName || !businessSubdomain) {
      return NextResponse.json({ success: false, message: 'Dados do formulário estão incompletos.' }, { status: 400 });
    }

    // ==========================================================
    // NOVA VALIDAÇÃO DE SENHA ADICIONADA AQUI
    // ==========================================================
    if (!isPasswordSecure(userPassword)) {
      return NextResponse.json({ 
        success: false, 
        message: 'A senha não é segura. Ela deve ter no mínimo 8 caracteres, com pelo menos uma letra e um número.' 
      }, { status: 400 });
    }
    // ==========================================================

    const normalizedEmail = userEmail.toLowerCase();
    const normalizedSubdomain = businessSubdomain.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Este endereço de e-mail já está em uso.' }, { status: 409 });
    }

    const existingBusiness = await prisma.business.findFirst({
      where: {
        OR: [
          { name: { equals: businessName, mode: 'insensitive' } },
          { subdomain: normalizedSubdomain },
        ],
      },
    });
    if (existingBusiness) {
      if (existingBusiness.name.toLowerCase() === businessName.toLowerCase()) {
        return NextResponse.json({ success: false, message: 'Este nome de negócio já está em uso.' }, { status: 409 });
      }
      if (existingBusiness.subdomain === normalizedSubdomain) {
        return NextResponse.json({ success: false, message: 'Este endereço (subdomínio) já está em uso.' }, { status: 409 });
      }
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.stripePriceId) {
      return NextResponse.json({ success: false, message: 'Plano ou ID de preço da Stripe não encontrado.' }, { status: 404 });
    }

    const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${APP_URL}/checkout/success`,
      cancel_url: `${APP_URL}/checkout?planId=${plan.id}`,
      metadata: {
        planId: plan.id,
        userName,
        userEmail: normalizedEmail,
        userPassword,
        businessName,
        businessSubdomain: normalizedSubdomain,
      }
    };

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), active: true },
      });
      if (coupon && coupon.stripeCouponId) {
        checkoutSessionParams.discounts = [{ coupon: coupon.stripeCouponId }];
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionParams);

    return NextResponse.json({ success: true, sessionId: checkoutSession.id });

  } catch (error: unknown) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ success: false, message: 'Erro ao criar a sessão de checkout.', details: errorMessage }, { status: 500 });
  }
}