
// src/app/api/auth/verify-email/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://lvh.me:3000';

export async function GET(request: Request) {
  // Extrai o token dos parâmetros da URL
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    // Redireciona para uma página de erro se o token não for fornecido
    return NextResponse.redirect(`${APP_URL}/login?error=verification_failed`);
  }

  try {
    // 1. Procura por um usuário que tenha este token de verificação
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    // Se não encontrar um usuário ou se o e-mail dele já foi verificado, o link é inválido
    if (!user || user.emailVerified) {
      return NextResponse.redirect(`${APP_URL}/login?error=invalid_or_expired_token`);
    }

    // 2. SUCESSO! Atualiza o usuário no banco de dados
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(), // Marca a data e hora da verificação
        emailVerificationToken: null, // Limpa o token para que não possa ser usado novamente
      },
    });

    // 3. Redireciona o usuário para a página de login com uma mensagem de sucesso
    return NextResponse.redirect(`${APP_URL}/login?verified=true`);

  } catch (error) {
    console.error('[EMAIL_VERIFICATION_ERROR]', error);
    return NextResponse.redirect(`${APP_URL}/login?error=server_error`);
  }
}