// Caminho: src/app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Importa o helper de cookies
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Função para CADASTRAR um novo cliente (CORRIGIDA)
export async function POST(request: Request) {
  // Lógica de autenticação corrigida para ler o cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Adicionado o campo 'observations'
    const { name, phone, email, observations } = body;

    if (!name) {
      return NextResponse.json({ message: 'O nome é obrigatório.' }, { status: 400 });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        phone,
        email,
        observations,
        businessId: session.businessId,
      },
    });
    
    // Revalida o cache da página de clientes para a lista atualizar
    revalidatePath('/dashboard/clientes');

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para LISTAR todos os clientes (CORRIGIDA)
export async function GET() {
  // Lógica de autenticação corrigida para ler o cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = await verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const clients = await prisma.client.findMany({
      where: {
        businessId: session.businessId,
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