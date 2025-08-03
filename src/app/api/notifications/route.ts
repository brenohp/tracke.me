// Caminho: src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/session';
import prisma from '@/lib/prisma';
// A importação 'revalidatePath' foi removida.

export async function GET() {
  // ... (código da função GET permanece o mesmo)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

export async function DELETE() {
  // ... (código da função DELETE permanece o mesmo)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    await prisma.notification.deleteMany({
      where: {
        userId: session.userId,
      },
    });

    return NextResponse.json({ message: 'Notificações limpas com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error("Erro ao limpar notificações:", error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}