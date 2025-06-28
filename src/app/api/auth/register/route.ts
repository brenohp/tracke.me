// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, ownerName, email, password } = body;

    if (!businessName || !ownerName || !email || !password) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios: nome do negócio, seu nome, email e senha.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este e-mail já está em uso.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.$transaction(async (tx) => {
      const newBusiness = await tx.business.create({
        data: {
          name: businessName,
        },
      });

      const newOwner = await tx.user.create({
        data: {
          name: ownerName,
          email,
          password: hashedPassword,
          role: 'OWNER',
          businessId: newBusiness.id,
        },
      });
      
      return newOwner;
    });

    // Bloco Corrigido: Cria um objeto de retorno explícito sem a senha
    const userToReturn = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        businessId: newUser.businessId,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };
    return NextResponse.json(userToReturn, { status: 201 });

  } catch (error) {
    console.error('Erro no cadastro de negócio:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}