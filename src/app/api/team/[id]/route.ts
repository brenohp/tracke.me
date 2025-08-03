// Caminho: src/app/api/team/[id]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para ATUALIZAR (EDITAR) um membro
export async function PUT(request: Request) {
  // Extrai o ID manualmente da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const memberIdToEdit = pathnameParts[pathnameParts.indexOf('team') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  if (session.role !== 'OWNER') {
    return NextResponse.json(
      { message: 'Acesso negado. Apenas o proprietário pode editar membros.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, role } = body;

    if (!name || !role) {
      return NextResponse.json({ message: 'Nome e cargo são obrigatórios.' }, { status: 400 });
    }
    
    const memberToEdit = await prisma.user.findFirst({
      where: { id: memberIdToEdit, businessId: session.businessId },
    });

    if (!memberToEdit) {
      return NextResponse.json(
        { message: 'Membro não encontrado ou não pertence à sua equipe.' },
        { status: 404 }
      );
    }
    
    if (memberToEdit.id === session.userId && role !== 'OWNER') {
      return NextResponse.json({ message: 'O proprietário não pode alterar o seu próprio cargo.' }, { status: 400 });
    }

    const updatedMember = await prisma.user.update({
      where: { id: memberIdToEdit },
      data: {
        name,
        role,
      },
    });

    revalidatePath('/dashboard/team');

    const memberToReturn = {
      id: updatedMember.id,
      name: updatedMember.name,
      email: updatedMember.email,
      role: updatedMember.role,
      businessId: updatedMember.businessId,
      createdAt: updatedMember.createdAt,
      updatedAt: updatedMember.updatedAt,
    };
    
    return NextResponse.json(memberToReturn, { status: 200 });
    
  } catch (error) {
    console.error('Erro ao atualizar membro da equipe:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor ao atualizar o membro.' },
      { status: 500 }
    );
  }
}

// Função para DELETAR um membro
export async function DELETE(request: Request) {
  // Extrai o ID manualmente da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const memberIdToDelete = pathnameParts[pathnameParts.indexOf('team') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  if (session.role !== 'OWNER') {
    return NextResponse.json(
      { message: 'Acesso negado. Apenas o proprietário pode remover membros.' },
      { status: 403 }
    );
  }

  if (memberIdToDelete === session.userId) {
    return NextResponse.json(
        { message: 'Você não pode remover a si mesmo da equipe.' },
        { status: 400 }
      );
  }

  try {
    const member = await prisma.user.findFirst({
      where: {
        id: memberIdToDelete,
        businessId: session.businessId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: 'Membro não encontrado ou não pertence à sua equipe.' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: memberIdToDelete },
    });

    revalidatePath('/dashboard/team');

    return NextResponse.json({ message: 'Membro da equipe removido com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao remover membro da equipe:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor ao remover o membro.' },
      { status: 500 }
    );
  }
}