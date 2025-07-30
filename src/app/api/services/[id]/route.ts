// Caminho: src/app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para ATUALIZAR um cliente
export async function PUT(request: Request) {
  // Extrai o ID manualmente da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const clientId = pathnameParts[pathnameParts.indexOf('clients') + 1];
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const client = await prisma.client.findFirst({
      where: { id: clientId, businessId: session.businessId },
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado ou acesso negado.' }, { status: 404 });
    }

    const body = await request.json();
    const { name, phone, email, observations } = body;

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { name, phone, email, observations },
    });
    
    revalidatePath('/dashboard/clients');

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${clientId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para DELETAR um cliente
export async function DELETE(request: Request) {
  // Extrai o ID manualmente da URL
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split('/');
  const clientId = pathnameParts[pathnameParts.indexOf('clients') + 1];

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const client = await prisma.client.findFirst({
      where: { id: clientId, businessId: session.businessId },
    });

    if (!client) {
      return NextResponse.json({ message: 'Cliente não encontrado ou acesso negado.' }, { status: 404 });
    }

    await prisma.client.delete({ where: { id: clientId } });
    
    revalidatePath('/dashboard/clients');

    return NextResponse.json({ message: 'Cliente excluído com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao deletar cliente ${clientId}:`, error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}