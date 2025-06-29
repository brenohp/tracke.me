// src/app/api/services/route.ts
import { NextResponse, type NextRequest } from 'next/server'; // Importa NextRequest
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { parse } from 'cookie'; // Importa o parser de cookie

// Função para ler o token de forma robusta
function getSessionFromRequest(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return verifyToken(cookies.token || '');
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request); // Usa a nova função
  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  // ... (o resto da sua lógica POST permanece igual)
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
      data: { name, description, price, duration, businessId: session.businessId },
    });
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) { // Usa NextRequest aqui também
  const session = getSessionFromRequest(request); // Usa a nova função
  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  // ... (o resto da sua lógica GET permanece igual)
  try {
    const services = await prisma.service.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}