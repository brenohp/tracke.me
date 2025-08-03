// src/app/api/timeoffs/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers'; // 1. Importa o helper de cookies

export async function DELETE(request: Request) {
  // 2. Extrai o ID manualmente da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const timeOffId = pathnameParts[pathnameParts.indexOf('timeoffs') + 1];

  // 3. Usa a autenticação via httpOnly cookie, nosso padrão de segurança
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const timeOff = await prisma.timeOff.findFirst({
      where: { 
        id: timeOffId, 
        // Garante que o usuário só pode deletar seus próprios bloqueios
        userId: session.userId 
      },
    });

    if (!timeOff) {
      return NextResponse.json({ message: 'Bloqueio não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.timeOff.delete({
      where: { id: timeOffId },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content é uma boa prática para DELETE
  } catch (error) {
    console.error(`Erro ao deletar bloqueio ${timeOffId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}