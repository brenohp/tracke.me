// src/app/api/clients/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

// Função para CADASTRAR um novo cliente
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, email } = body;

    if (!name) {
      return NextResponse.json({ message: 'O nome é obrigatório.' }, { status: 400 });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        phone,
        email,
        businessId: session.businessId, // <-- LÓGICA ATUALIZADA
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para LISTAR todos os clientes do negócio
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      where: {
        businessId: session.businessId, // <-- LÓGICA ATUALIZADA
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}