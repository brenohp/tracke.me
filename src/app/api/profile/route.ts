// Caminho: src/app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// Função para OBTER os dados do perfil do usuário logado
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

    // Se o usuário forneceu uma nova senha, validamos a senha atual
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'A senha atual é necessária para definir uma nova.' }, { status: 400 });
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'A senha atual está incorreta.' }, { status: 403 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedNewPassword;
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: dataToUpdate,
    });

    // Revalida o cache para que as alterações apareçam em todo o site
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/settings/profile');

    return NextResponse.json({ message: 'Perfil atualizado com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}