// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const serializedCookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
    domain: 'localhost', // Adicionado para garantir que o cookie seja limpo no domínio correto
    expires: new Date(0), // Força a expiração no passado
  });

  const response = NextResponse.json({ message: 'Logout bem-sucedido.' });
  response.headers.set('Set-Cookie', serializedCookie);
  return response;
}