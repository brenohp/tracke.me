// Caminho: src/app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// 1. Reutilizamos nossa função de validação de senha
const isPasswordSecure = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasLetter && hasNumber;
};

// A função GET para obter os dados do perfil continua a mesma
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para ATUALIZAR os dados do perfil do usuário logado
export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    if (!name) {
      return NextResponse.json({ message: 'O nome é obrigatório.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    const dataToUpdate: { name: string; password?: string } = { name };

    // Se o usuário forneceu uma nova senha, validamos tudo
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'A senha atual é necessária para definir uma nova.' }, { status: 400 });
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'A senha atual está incorreta.' }, { status: 403 });
      }

      // 2. Adicionamos a verificação de segurança para a NOVA senha
      if (!isPasswordSecure(newPassword)) {
        return NextResponse.json({ 
          message: 'A nova senha não é segura. Ela deve ter no mínimo 8 caracteres, com pelo menos uma letra e um número.' 
        }, { status: 400 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedNewPassword;
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: dataToUpdate,
    });

    revalidatePath('/dashboard/settings/profile');

    return NextResponse.json({ message: 'Perfil atualizado com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
