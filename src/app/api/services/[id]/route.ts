// src/app/api/services/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { parse } from 'cookie';

interface RouteContext {
  params: { id: string };
}

function getSessionFromRequest(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return verifyToken(cookies.token || '');
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const serviceId = params.id;
  const session = getSessionFromRequest(request);
  
  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  // ... (o resto da lógica PUT continua)
  try {
    const service = await prisma.service.findFirst({ where: { id: serviceId, businessId: session.businessId } });
    if (!service) { return NextResponse.json({ message: 'Serviço não encontrado ou acesso negado.' }, { status: 404 }); }
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

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const serviceId = params.id;
  const session = getSessionFromRequest(request);
  
  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  // ... (o resto da lógica DELETE continua)
  try {
    const service = await prisma.service.findFirst({ where: { id: serviceId, businessId: session.businessId } });
    if (!service) { return NextResponse.json({ message: 'Serviço não encontrado ou acesso negado.' }, { status: 404 }); }
    await prisma.service.delete({ where: { id: serviceId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Erro ao deletar serviço ${serviceId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}