// Caminho do ficheiro: src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// A função POST permanece igual
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  const session = await verifyToken(token || '');
  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  
  if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price, durationInMinutes, professionals } = body;

    if (!name || !price || !durationInMinutes) {
      return NextResponse.json({ message: 'Nome, preço e duração são obrigatórios.' }, { status: 400 });
    }

    if (!Array.isArray(professionals) || professionals.length === 0) {
      return NextResponse.json(
        { message: 'É necessário associar pelo menos um profissional ao serviço.' },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        durationInMinutes,
        businessId: session.businessId,
        professionals: {
          connect: professionals.map((id: string) => ({ id })),
        },
      },
    });

    revalidatePath('/dashboard/services');

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// CORREÇÃO: Adicionado '_' para indicar que 'request' não é utilizado
export async function GET() { 
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const session = await verifyToken(token || '');
  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  
  try {
    const services = await prisma.service.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: 'desc' },
      include: {
        professionals: {
          select: { id: true, name: true }
        }
      }
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}