// src/app/api/auth/me/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // 1. Importa a função correta
import { verifyToken, type UserSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function GET() {
  // 2. Usa a função 'cookies()' para obter o cookie store
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const session = await verifyToken(token) as UserSession | null;
  if (!session) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  // O resto do código permanece o mesmo
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, businessId: true }
  });

  if (!user) {
    return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json(user);
}