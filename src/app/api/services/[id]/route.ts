// src/app/api/services/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';

interface RouteContext {
  params: { id: string };
}

export async function PUT(request: Request, { params }: RouteContext) {
  const serviceId = params.id;

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
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId: session.businessId },
    });

    if (!service) {
      return NextResponse.json({ message: 'Serviço não encontrado ou acesso negado.' }, { status: 404 });
    }

    const body = await request.json();
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { name: body.name, description: body.description, price: body.price, duration: body.duration },
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error(`Erro ao atualizar serviço ${serviceId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const serviceId = params.id;

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
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId: session.businessId },
    });

    if (!service) {
      return NextResponse.json({ message: 'Serviço não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Erro ao deletar serviço ${serviceId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}