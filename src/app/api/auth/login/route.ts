// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. Extrai email e senha do corpo da requisição
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    // 2. Procura o usuário no banco de dados pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não for encontrado, a senha não é verificada
    if (!user) {
      return NextResponse.json(
        { message: 'Credenciais inválidas.' }, // Mensagem genérica por segurança
        { status: 401 } // Unauthorized
      );
    }

    // 3. Compara a senha enviada com a senha criptografada no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Credenciais inválidas.' }, // Mesma mensagem genérica
        { status: 401 }
      );
    }

    // 4. Se a senha estiver correta, gera o token JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('A chave secreta JWT não está definida.');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d', // O token expira em 1 dia
      }
    );

    // 5. Retorna o token para o cliente
    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro no servidor.' },
      { status: 500 }
    );
  }
}