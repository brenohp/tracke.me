// Caminho: src/app/api/availability/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para OBTER a disponibilidade de um usuário
export async function GET() {
  // Lógica de autenticação corrigida para ler o cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
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

// Função para GUARDAR (sobrescrever) a disponibilidade de um usuário
export async function POST(request: Request) {
  // Lógica de autenticação corrigida para ler o cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body: { dayOfWeek: number; startTime: string; endTime: string }[] = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ message: 'O corpo da requisição deve ser um array.' }, { status: 400 });
    }

    // Prepara os novos dados de disponibilidade com o userId da sessão
    const dataToCreate = body.map(slot => ({
      ...slot,
      userId: session.userId,
    }));

    // Usa uma transação para apagar a disponibilidade antiga e criar a nova
    // Isso garante que a operação seja atómica (ou tudo funciona, ou nada)
    await prisma.$transaction([
      prisma.availability.deleteMany({ where: { userId: session.userId } }),
      prisma.availability.createMany({
        data: dataToCreate,
      }),
    ]);
    
    // Revalida o cache da futura página de configurações/disponibilidade
    revalidatePath('/dashboard/settings/availability');

    return NextResponse.json({ message: 'Disponibilidade atualizada com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao definir disponibilidade:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}