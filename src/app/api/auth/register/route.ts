// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // 1. Extrai o novo campo 'subdomain' do corpo da requisição
    const body = await request.json();
    const { businessName, ownerName, email, password, phone, subdomain } = body;

    if (!businessName || !ownerName || !email || !password || !subdomain) {
      return NextResponse.json(
        { message: 'Todos os campos, incluindo o subdomínio, são obrigatórios.' },
        { status: 400 }
      );
    }

    // 2. Validação do formato do subdomínio (letras minúsculas, números e hífens)
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        { message: 'Subdomínio inválido. Use apenas letras minúsculas, números e hífens.' },
        { status: 400 }
      );
    }
    
    // 3. Verifica se o e-mail ou o subdomínio já estão em uso
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingBusiness = await prisma.business.findUnique({ where: { subdomain } });

    if (existingUser) {
      return NextResponse.json({ message: 'Este e-mail já está em uso.' }, { status: 409 });
    }
    if (existingBusiness) {
      return NextResponse.json({ message: 'Este subdomínio já está em uso. Por favor, escolha outro.' }, { status: 409 });
    }

    // O resto da lógica continua igual...
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.$transaction(async (tx) => {
      const newBusiness = await tx.business.create({
        data: {
          name: businessName,
          phone,
          subdomain, // <-- CAMPO ADICIONADO AQUI
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