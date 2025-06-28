// src/app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

interface RouteContext {
  params: { id: string };
}

// Função para ATUALIZAR um cliente
export async function PUT(request: Request, { params }: RouteContext) {
  const clientId = params.id;
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
    // Agora verificamos se o cliente pertence ao NEGÓCIO do usuário
    const client = await prisma.client.findFirst({
      where: { id: clientId, businessId: session.businessId }, // <-- LÓGICA ATUALIZADA
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado ou acesso negado.' }, { status: 404 });
    }

    const body = await request.json();
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
      },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${clientId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para DELETAR um cliente
export async function DELETE(request: Request, { params }: RouteContext) {
  const clientId = params.id;
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
    const client = await prisma.client.findFirst({
      where: { id: clientId, businessId: session.businessId }, // <-- LÓGICA ATUALIZADA
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.client.delete({ where: { id: clientId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Erro ao deletar cliente ${clientId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}