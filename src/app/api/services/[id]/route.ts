// Caminho: src/app/api/services/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para ATUALIZAR (EDITAR) um serviço
export async function PUT(request: Request) {
  // Extrai o ID do serviço da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const serviceId = pathnameParts[pathnameParts.indexOf('services') + 1];
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    // Verifica se o serviço existe e pertence ao negócio do usuário
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId: session.businessId },
    });

    if (!service) {
      return NextResponse.json({ message: 'Serviço não encontrado ou acesso negado.' }, { status: 404 });
    }

    const body = await request.json();
    // Campos relevantes para um serviço
    const { name, description, price, durationInMinutes, status } = body;

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { name, description, price, durationInMinutes, status },
    });
    
    revalidatePath('/dashboard/services');

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error(`Erro ao atualizar serviço ${serviceId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para DELETAR um serviço
export async function DELETE(request: Request) {
  // Extrai o ID do serviço da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const serviceId = pathnameParts[pathnameParts.indexOf('services') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    // Verifica se o serviço existe e pertence ao negócio do usuário
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId: session.businessId },
    });

    if (!service) {
      return NextResponse.json({ message: 'Serviço não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.service.delete({ where: { id: serviceId } });
    
    revalidatePath('/dashboard/services');

    return NextResponse.json({ message: 'Serviço excluído com sucesso.' }, { status: 200 });
  } catch (error) { // <<< CORRIGIDO AQUI
    console.error(`Erro ao deletar serviço ${serviceId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}