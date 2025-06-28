// src/app/api/timeoffs/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

interface RouteContext {
  params: { id: string };
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const timeOffId = params.id;
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
  }

  try {
    const timeOff = await prisma.timeOff.findFirst({
      where: { id: timeOffId, userId: session.userId },
    });

    if (!timeOff) {
      return NextResponse.json({ message: 'Bloqueio não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.timeOff.delete({
      where: { id: timeOffId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Erro ao deletar bloqueio ${timeOffId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}