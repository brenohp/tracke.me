// Caminho do arquivo: src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { UserSession } from '@/lib/session';

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

    const sessionData: UserSession = {
      userId: user.id,
      businessId: user.businessId,
      email: user.email,
      role: user.role as 'ADMIN' | 'OWNER' | 'EMPLOYEE',
    };

    const token = jwt.sign(sessionData, process.env.JWT_SECRET!, { expiresIn: '7d' });

    // --- INÍCIO DA CORREÇÃO ---
    // Remove a porta do domínio para o cookie
    const appDomain = (process.env.NEXT_PUBLIC_APP_DOMAIN || 'lvh.me:3000').split(':')[0];
    const domain = process.env.NODE_ENV === 'production' ? `.${appDomain}` : appDomain;

    const serializedCookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      domain: domain, // <-- Agora está correto: 'lvh.me'
    });
    // --- FIM DA CORREÇÃO ---
    
    const response = NextResponse.json({
      message: 'Login bem-sucedido!',
      subdomain: user.business.subdomain,
    }, { status: 200 });
    
    response.headers.set('Set-Cookie', serializedCookie);

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}