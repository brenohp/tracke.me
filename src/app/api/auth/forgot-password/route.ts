// src/app/api/auth/forgot-password/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { addHours } from 'date-fns'; // Usaremos para definir a validade do token
import { emailService } from '@/lib/email';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://lvh.me:3000';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'O e-mail é obrigatório.' }, { status: 400 });
    }

    // 1. Encontra o usuário no banco de dados pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Se não encontrar um usuário, por segurança, retornamos uma mensagem genérica de sucesso.
    // Isso evita que pessoas mal-intencionadas usem este formulário para descobrir quais e-mails estão cadastrados.
    if (!user) {
      console.log(`Solicitação de redefinição para e-mail não cadastrado: ${email}`);
      return NextResponse.json({ success: true, message: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' });
    }

    // 2. Gera um token de redefinição seguro e define sua data de expiração
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = addHours(new Date(), 1); // Token é válido por 1 hora

    // 3. Salva o token e a data de expiração no registro do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: tokenExpires,
      },
    });

    // 4. Envia o e-mail de redefinição usando nosso serviço
    const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordReset(user.email, user.name, resetLink);

    return NextResponse.json({ success: true, message: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' });

  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error);
    // Mesmo em caso de erro, retornamos uma resposta genérica para não vazar informações.
    return NextResponse.json({ success: true, message: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' });
  }
}