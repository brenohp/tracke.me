// src/app/api/auth/resend-verification/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { emailService } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://lvh.me:3000';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ success: false, message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuário não encontrado.' }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json({ success: false, message: 'Este e-mail já foi verificado.' }, { status: 400 });
    }

    const newVerificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: newVerificationToken,
      },
    });

    const confirmationLink = `${APP_URL}/api/auth/verify-email?token=${newVerificationToken}`;
    await emailService.sendAccountConfirmation(user.email, user.name, confirmationLink);

    return NextResponse.json({ success: true, message: 'E-mail de confirmação reenviado.' });

  } catch (error) {
    console.error('[RESEND_VERIFICATION_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}