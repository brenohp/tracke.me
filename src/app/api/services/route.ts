// src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

export async function POST(request: Request) {
  // Bloco de Autenticação CORRIGIDO
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token de autorização ausente ou malformatado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado ou token inválido.' }, { status: 401 });
  }
  
  if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price, duration } = body;

    if (!name || !price || !duration) {
      return NextResponse.json({ message: 'Nome, preço e duração são obrigatórios.' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        businessId: session.businessId,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Bloco de Autenticação CORRIGIDO
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado ou token inválido.' }, { status: 401 });
  }

  try {
    const services = await prisma.service.findMany({
      where: {
        businessId: session.businessId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}