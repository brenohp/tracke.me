// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Cria um cookie com o mesmo nome, mas com valor vazio e data de expiração no passado
  const serializedCookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Expira imediatamente
    path: '/',
  });

  const response = NextResponse.json({ message: 'Logout bem-sucedido.' });
  response.headers.set('Set-Cookie', serializedCookie);
  return response;
}