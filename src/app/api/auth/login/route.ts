// Caminho do arquivo: src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; // 1. Importa de 'jose' em vez de 'jsonwebtoken'
import { serialize } from 'cookie';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });

    if (!user || !user.business) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    // --- 2. LÓGICA DE CRIAÇÃO DO TOKEN ATUALIZADA ---
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      userId: user.id,
      businessId: user.businessId,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);
    // --- FIM DA ATUALIZAÇÃO ---

    const appDomain = (process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000').split(':')[0];
    const domain = process.env.NODE_ENV === 'production' ? `.${appDomain}` : appDomain;

    const serializedCookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
      domain: domain,
    });
    
    const response = NextResponse.json({
      message: 'Login bem-sucedido!',
      subdomain: user.business.subdomain,
      role: user.role,
    }, { status: 200 });
    
    response.headers.set('Set-Cookie', serializedCookie);

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}