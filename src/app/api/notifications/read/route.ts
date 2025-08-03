// Caminho: src/app/api/notifications/read/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    // Atualiza todas as notificações do usuário que ainda não foram lidas
    await prisma.notification.updateMany({
      where: {
        userId: session.userId,
        read: false, // Alvo são apenas as não lidas
      },
      data: {
        read: true, // Marca como lidas
      },
    });

    return NextResponse.json({ message: 'Notificações marcadas como lidas.' }, { status: 200 });

  } catch (error) {
    console.error("Erro ao marcar notificações como lidas:", error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}