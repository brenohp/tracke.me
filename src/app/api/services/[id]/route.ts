// Caminho: src/app/api/services/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// NOVA FUNÇÃO PARA ATUALIZAR (EDITAR) UM SERVIÇO
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Autenticação e Autorização
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const serviceId = params.id;

  try {
    const body = await request.json();
    const { name, description, price, durationInMinutes, professionals, status } = body;

    // Validação básica dos dados recebidos
    if (!name || !price || !durationInMinutes || !status) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }
    if (!Array.isArray(professionals)) {
        return NextResponse.json({ message: 'A lista de profissionais é inválida.' }, { status: 400 });
    }

    // 2. Verificação de Segurança
    // Garante que o serviço a ser atualizado pertence ao negócio do usuário.
    const serviceToUpdate = await prisma.service.findFirst({
        where: { id: serviceId, businessId: session.businessId }
    });

    if (!serviceToUpdate) {
        return NextResponse.json({ message: 'Serviço não encontrado ou não pertence ao seu negócio.' }, { status: 404 });
    }

    // 3. Atualização do Serviço no Banco de Dados
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description,
        price,
        durationInMinutes,
        status,
        // A cláusula 'set' substitui a lista antiga de profissionais pela nova.
        professionals: {
          set: professionals.map((id: string) => ({ id })),
        },
      },
    });

    // 4. Revalidação do Cache
    revalidatePath('/dashboard/services');

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor ao atualizar o serviço.' },
      { status: 500 }
    );
  }
}


// A sua função DELETE continua aqui, sem alterações.
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  if (session.role !== 'OWNER' && session.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const serviceId = params.id;

  try {
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
        businessId: session.businessId,
      },
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Serviço não encontrado ou não pertence ao seu negócio.' },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    revalidatePath('/dashboard/services');

    return NextResponse.json({ message: 'Serviço excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor ao excluir o serviço.' },
      { status: 500 }
    );
  }
}