// src/app/api/auth/reset-password/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Função auxiliar para validar a força da senha
const isPasswordSecure = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasLetter && hasNumber;
};

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, message: 'O token e a nova senha são obrigatórios.' }, { status: 400 });
    }

    if (!isPasswordSecure(newPassword)) {
      return NextResponse.json({ 
        success: false, 
        message: 'A nova senha não é segura. Ela deve ter no mínimo 8 caracteres, com pelo menos uma letra e um número.' 
      }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'O token é inválido ou já expirou.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Senha redefinida com sucesso!' });

  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}