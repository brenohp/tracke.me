// src/app/api/checkout/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://lvh.me:3000';

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

    const plan = await prisma.plan.findUnique({ where: { id: planId } });

    if (!plan || !plan.stripePriceId) {
      return NextResponse.json({ success: false, message: 'Plano ou ID de preço da Stripe não encontrado.' }, { status: 404 });
    }

    const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      // ==========================================================
      // CORREÇÃO APLICADA AQUI
      // ==========================================================
      success_url: `${APP_URL}/checkout/success`,
      cancel_url: `${APP_URL}/checkout?planId=${plan.id}`,
      // ==========================================================
      metadata: {
        planId: plan.id,
        userName,
        userEmail,
        userPassword,
        businessName,
        businessSubdomain,
      }
    };

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { 
          code: couponCode.toUpperCase(),
          active: true,
        },
      });

      if (coupon && coupon.stripeCouponId) {
        checkoutSessionParams.discounts = [{
          coupon: coupon.stripeCouponId,
        }];
        console.log(`Aplicando cupom ${coupon.code} (Stripe ID: ${coupon.stripeCouponId})`);
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