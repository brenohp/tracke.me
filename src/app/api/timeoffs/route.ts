// src/app/api/timeoffs/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { parseISO } from 'date-fns';

// Função para ADICIONAR um novo bloqueio de horário (férias, folga, etc.)
export async function POST(request: Request) {
  // Bloco de autenticação CORRIGIDO
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token de autorização ausente ou malformatado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado. Token inválido ou expirado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { startTime, endTime, reason } = body;

    if (!startTime || !endTime) {
      return NextResponse.json({ message: 'Horário de início e fim são obrigatórios.' }, { status: 400 });
    }

    const newTimeOff = await prisma.timeOff.create({
      data: {
        startTime: parseISO(startTime),
        endTime: parseISO(endTime),
        reason,
        userId: session.userId,
      },
    });

    return NextResponse.json(newTimeOff, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar bloqueio de horário:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para LISTAR todos os bloqueios de horário do profissional
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
    const timeOffs = await prisma.timeOff.findMany({
      where: { userId: session.userId },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(timeOffs, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar bloqueios de horário:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}