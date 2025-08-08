// src/app/api/customer-portal/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

const APP_URL = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://lvh.me:3000';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  // A sessão agora contém o subdomínio, conforme nosso schema
  if (!session || !session.subdomain) {
    return NextResponse.json({ success: false, message: 'Não autorizado ou subdomínio não encontrado na sessão.' }, { status: 401 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
      select: { stripeCustomerId: true },
    });

    if (!business || !business.stripeCustomerId) {
      return NextResponse.json({ success: false, message: 'ID de cliente da Stripe não encontrado.' }, { status: 404 });
    }

    // ==========================================================
    // CORREÇÃO APLICADA AQUI
    // ==========================================================
    // 1. Extraímos o domínio principal (ex: lvh.me:3000) da nossa variável de ambiente
    const mainDomain = new URL(APP_URL).host;
    const protocol = new URL(APP_URL).protocol;

    // 2. Construímos a URL de retorno dinâmica usando o subdomínio da sessão do usuário
    const returnUrl = `${protocol}//${session.subdomain}.${mainDomain}/dashboard/settings/billing`;

    // 3. Criamos a sessão do portal com a URL de retorno correta
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: business.stripeCustomerId,
      return_url: returnUrl,
    });
    // ==========================================================

    return NextResponse.json({ success: true, url: portalSession.url });

  } catch (error: unknown) {
    console.error('[STRIPE_PORTAL_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ success: false, message: 'Erro ao criar a sessão do portal.', details: errorMessage }, { status: 500 });
  }
}