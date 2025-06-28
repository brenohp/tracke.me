// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { serialize } from 'cookie'; // Importaremos uma função auxiliar

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('A chave secreta JWT não está definida.');
    }

    // O payload do token continua o mesmo
    const token = jwt.sign(
      {
        userId: user.id,
        businessId: user.businessId,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );
    
    // --- MUDANÇA PRINCIPAL AQUI ---
    // Em vez de retornar o token, vamos configurar o cookie
    
    // Serializa o cookie com as flags de segurança
    const serializedCookie = serialize('token', token, {
      httpOnly: true, // Impede acesso via JavaScript
      secure: process.env.NODE_ENV === 'production', // Use https em produção
      sameSite: 'strict', // Proteção contra ataques CSRF
      maxAge: 60 * 60 * 24, // 1 dia em segundos
      path: '/', // O cookie estará disponível em todo o site
    });

    // Cria a resposta com uma mensagem de sucesso e define o cabeçalho do cookie
    const response = NextResponse.json(
      { message: 'Login bem-sucedido.' },
      { status: 200 }
    );
    
    response.headers.set('Set-Cookie', serializedCookie);

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}