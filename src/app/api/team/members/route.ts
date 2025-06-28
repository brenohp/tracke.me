// src/app/api/team/members/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // 1. Autenticação: Verifica se há um usuário logado
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);

  if (!session) {
    return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
  }

  // 2. Autorização: Verifica se o usuário logado tem permissão para esta ação
  if (session.role !== 'OWNER') {
    return NextResponse.json(
      { message: 'Acesso negado. Apenas o proprietário do negócio pode adicionar funcionários.' },
      { status: 403 } // 403 Forbidden
    );
  }

  try {
    // 3. Extração e validação dos dados do novo funcionário
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nome, email e senha são obrigatórios para o novo funcionário.' },
        { status: 400 }
      );
    }

    // 4. Verifica se o e-mail já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este e-mail já está sendo utilizado por outro usuário.' },
        { status: 409 } // 409 Conflict
      );
    }

    // 5. Criptografa a senha do novo funcionário
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Cria o novo usuário com a role explícita de 'EMPLOYEE'
    const newEmployee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'EMPLOYEE',
      },
    });

    // Bloco Corrigido: Cria um objeto de retorno sem o campo da senha
    const employeeToReturn = {
      id: newEmployee.id,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      createdAt: newEmployee.createdAt,
      updatedAt: newEmployee.updatedAt,
    };

    return NextResponse.json(employeeToReturn, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}