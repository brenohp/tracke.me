// Caminho: src/app/api/team/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// Função para LISTAR todos os membros da equipe
export async function GET() { // <-- PARÂMETRO REMOVIDO
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const teamMembers = await prisma.user.findMany({
      where: {
        businessId: session.businessId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true, 
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(teamMembers, { status: 200 });
  } catch (error) {
    console.error('Erro ao listar membros da equipe:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

// Função para ADICIONAR um novo membro da equipe
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = verifyToken(token || '');

  if (!session || !session.businessId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  if (session.role !== 'OWNER') {
    return NextResponse.json(
      { message: 'Acesso negado. Apenas o proprietário pode adicionar funcionários.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nome, email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este e-mail já está sendo utilizado.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'EMPLOYEE',
        businessId: session.businessId,
      },
    });

    // Bloco Corrigido: Cria um objeto de retorno sem o campo da senha
    const employeeToReturn = {
      id: newEmployee.id,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      businessId: newEmployee.businessId,
      createdAt: newEmployee.createdAt,
      updatedAt: newEmployee.updatedAt,
    };

    revalidatePath('/dashboard/team');

    return NextResponse.json(employeeToReturn, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}