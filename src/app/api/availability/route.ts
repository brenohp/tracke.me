// src/app/api/availability/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

// Função para BUSCAR a jornada de trabalho semanal do profissional
export async function GET(request: Request) {
  // Bloco de autenticação CORRIGIDO
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
    const availability = await prisma.availability.findMany({
      where: { userId: session.userId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json(availability, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para DEFINIR ou ATUALIZAR a jornada de trabalho semanal completa
export async function POST(request: Request) {
  // Bloco de autenticação CORRIGIDO
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
    const body: { dayOfWeek: number; startTime: string; endTime: string }[] = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ message: 'O corpo da requisição deve ser um array.' }, { status: 400 });
    }
    
    const dataToCreate = body.map(slot => ({
      ...slot,
      userId: session.userId,
    }));

    // Transação para deletar o antigo e criar o novo. Variável 'result' removida.
    await prisma.$transaction([
      prisma.availability.deleteMany({ where: { userId: session.userId } }),
      prisma.availability.createMany({
        data: dataToCreate,
      }),
    ]);

    const newAvailability = await prisma.availability.findMany({
        where: { userId: session.userId },
        orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json(newAvailability, { status: 200 });
  } catch (error) {
    console.error('Erro ao definir disponibilidade:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}